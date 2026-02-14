import os
import asyncio
import json
import base64
import wave
import io
from google import genai
from google.genai import types
from dotenv import load_dotenv
from models import (
    JobOffer, AnalysisResult,
    ContractScanRequest, ContractScanResult,
    NegotiationRequest, NegotiationResult,
    RecommendationRequest, RecommendationResult, RecommendationItem,
    VoiceRequest, VoiceResponse,
    TranslateRequest, TranslateResponse
)

load_dotenv()

class SwarmOrchestrator:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = "gemini-3-flash-preview"

    async def _get_json_response(self, prompt: str) -> dict | None:
        """Get a JSON response from Gemini without using response_schema (avoids recursion bugs)."""
        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error in agent execution: {e}")
            import traceback
            traceback.print_exc()
            return None

    # ──────────────────────────────────────────────
    # Original Swarm Agents
    # ──────────────────────────────────────────────

    async def agent_legal(self, offer: JobOffer):
        prompt = f"""
        You are the 'Legal Guardian' agent. Analyze this job offer for migration risks.
        Origin: {offer.origin}
        Destination: {offer.destination}
        Role: {offer.job_description}
        Salary: {offer.salary}
        Full Text: {offer.offer_text}

        Task:
        1. Check compliance with {offer.origin} Emigration Acts and {offer.destination} Labor Laws.
        2. Detect signs of visa fraud or illegal contracting.
        3. Assign a risk score (0=Safe, 100=Dangerous).

        Return JSON with exactly these fields:
        - "risk_score" (integer 0-100)
        - "concerns" (array of strings)
        """
        return await self._get_json_response(prompt)

    async def agent_economist(self, offer: JobOffer):
        prompt = f"""
        You are the 'Economist' agent. Analyze the financial viability of this job offer.
        Origin: {offer.origin}
        Destination: {offer.destination}
        Salary: {offer.salary}

        Task:
        1. Calculate real value using Purchasing Power Parity (PPP).
        2. Estimate basic cost of living (Rent, Food, Transport) in {offer.destination}.
        3. Detect 'Poverty Traps' (wage < living cost).

        Return JSON with exactly these fields:
        - "verdict" (string)
        - "cost_analysis" (string)
        """
        return await self._get_json_response(prompt)

    async def agent_settler(self, offer: JobOffer):
        prompt = f"""
        You are the 'Settler' agent. Analyze the social and living conditions.
        Destination: {offer.destination}

        Task:
        1. Identify specific fines/laws tourists/migrants often miss (e.g. strict laws).
        2. List potential culture shocks.
        3. Assess Healthcare access and cost for migrants.
        4. Assess Education quality and cost for children (if applicable).
        5. Assess Housing and Safety conditions.

        Return JSON with exactly these fields:
        - "hidden_fines" (array of strings)
        - "culture_shocks" (array of strings)
        - "healthcare" (string)
        - "education" (string)
        - "housing_safety" (string)
        """
        return await self._get_json_response(prompt)

    async def analyze_offer(self, offer: JobOffer) -> AnalysisResult:
        legal_task = self.agent_legal(offer)
        econ_task = self.agent_economist(offer)
        settler_task = self.agent_settler(offer)

        legal_res, econ_res, settler_res = await asyncio.gather(legal_task, econ_task, settler_task)

        # Handle potential None results from failed API calls
        if not legal_res or not econ_res or not settler_res:
            raise Exception("One or more AI agents failed to respond. Please check your API key and try again.")

        risk_score = legal_res.get("risk_score", 50)
        verdict = econ_res.get("verdict", "Unable to determine")
        cost_analysis = econ_res.get("cost_analysis", "")

        advice = f"Legal Risk: {risk_score}%. {verdict}. "
        if risk_score > 70:
            advice += "CRITICAL WARNING: High legal risk detected. Do not proceed without lawyer."
        elif "poverty" in verdict.lower():
            advice += "Warning: improved salary recommended."
        else:
             advice += "Proceed with caution and awareness of local laws."

        return AnalysisResult(
            legal_risk=risk_score,
            economic_verdict=verdict + " | " + cost_analysis,
            culture_shocks=settler_res.get("culture_shocks", []),
            living_conditions={
                "Healthcare": settler_res.get("healthcare", "N/A"),
                "Education": settler_res.get("education", "N/A"),
                "Housing/Safety": settler_res.get("housing_safety", "N/A")
            },
            final_advice=advice,
            hidden_costs=settler_res.get("hidden_fines", [])
        )

    # ──────────────────────────────────────────────
    # Contract Scanner Agent (Gemini Vision)
    # ──────────────────────────────────────────────

    async def agent_contract_scanner(self, request: ContractScanRequest) -> ContractScanResult:
        """Uses Gemini's multimodal capabilities to OCR and analyze a contract image."""
        try:
            image_bytes = base64.b64decode(request.image_data)
            
            prompt_text = """
            You are a multilingual contract analysis expert. Analyze this contract/document image.

            Tasks:
            1. Extract ALL text from the image exactly as written (OCR). Preserve the original language.
            2. Detect the language of the document.
            3. Identify red flags: passport confiscation, excessive deductions, no holidays,
               unreasonable working hours, penalty clauses, unclear termination terms,
               illegal provisions, debt bondage indicators, restriction of movement.
            4. List specific negotiation points — clauses that should be changed/removed/added.
            5. Provide a brief summary of what this contract says.

            Return as JSON with fields:
            - extracted_text (string): the full OCR text
            - detected_language (string): the language name
            - red_flags (array of strings): each red flag found
            - negotiation_points (array of strings): each suggested negotiation point
            - summary (string): brief summary of the contract
            """
            
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=[
                    types.Content(parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                        types.Part.from_text(text=prompt_text),
                    ])
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            
            data = json.loads(response.text)
            return ContractScanResult(
                extracted_text=data.get("extracted_text", "Could not extract text"),
                detected_language=data.get("detected_language", "Unknown"),
                red_flags=data.get("red_flags", []),
                negotiation_points=data.get("negotiation_points", []),
                summary=data.get("summary", "No summary available")
            )
        except Exception as e:
            print(f"Contract scanner error: {e}")
            import traceback
            traceback.print_exc()
            return ContractScanResult(
                extracted_text=f"Error scanning contract: {str(e)}",
                detected_language="Unknown",
                red_flags=["Unable to process the image. Please try a clearer photo."],
                negotiation_points=[],
                summary="Error processing document"
            )

    # ──────────────────────────────────────────────
    # Negotiation Agent
    # ──────────────────────────────────────────────

    async def agent_negotiator(self, request: NegotiationRequest) -> NegotiationResult:
        """Analyzes a contract and generates negotiation strategies."""
        prompt = f"""
        You are an expert labor rights negotiator specializing in migrant worker contracts.

        Contract text: {request.contract_text}
        User's concerns: {request.user_concerns}
        Document language: {request.detected_language}

        Tasks:
        1. List the problematic clauses in the original contract.
        2. For each issue, suggest a specific improved version of the clause.
        3. Write a professional negotiation script the worker can use — polite but firm,
           citing relevant labor laws. Write this in {request.detected_language} if not English.
        4. Estimate how much safer the contract would be after these changes.

        Return JSON with:
        - "original_issues" (array of strings)
        - "suggested_changes" (array of strings): corresponding fixes for each issue
        - "negotiation_script" (string): a ready-to-use script
        - "risk_reduction" (string): e.g. "Estimated risk reduction: 85% → 25%"
        """

        result = await self._get_json_response(prompt)
        if result:
            return NegotiationResult(
                original_issues=result.get("original_issues", []),
                suggested_changes=result.get("suggested_changes", []),
                negotiation_script=result.get("negotiation_script", ""),
                risk_reduction=result.get("risk_reduction", "Unknown")
            )
        return NegotiationResult(
            original_issues=["Could not analyze contract"],
            suggested_changes=["Please try again"],
            negotiation_script="Error processing request",
            risk_reduction="Unknown"
        )

    # ──────────────────────────────────────────────
    # Recommendations Agent
    # ──────────────────────────────────────────────

    async def agent_recommender(self, request: RecommendationRequest) -> RecommendationResult:
        """Suggests better migration alternatives based on the current analysis."""
        prompt = f"""
        You are a global migration advisor. Based on this worker's profile, suggest better alternatives.

        Worker profile:
        - Origin: {request.origin}
        - Current destination: {request.destination}
        - Job role: {request.job_description}
        - Offered salary: {request.salary}
        - Legal risk of current offer: {request.legal_risk or 'N/A'}%

        Tasks:
        1. Suggest 3 alternative destinations where this worker could find:
           - Better legal protections
           - Higher real wages (PPP-adjusted)
           - Better quality of life
        2. For each, explain WHY it's better with specific facts.
        3. Give a realistic salary range for the same role.
        4. Rate safety on a scale (e.g., "High", "Very High").

        Return JSON with:
        - "alternatives" (array of objects with: "destination", "role", "salary_range", "why_better", "safety_score")
        - "summary" (string): brief overview of the recommendations
        """

        result = await self._get_json_response(prompt)
        if result:
            alternatives = result.get("alternatives", [])
            return RecommendationResult(
                alternatives=[
                    RecommendationItem(
                        destination=a.get("destination", "Unknown"),
                        role=a.get("role", "Unknown"),
                        salary_range=a.get("salary_range", "Unknown"),
                        why_better=a.get("why_better", ""),
                        safety_score=a.get("safety_score", "Unknown")
                    ) for a in alternatives
                ],
                summary=result.get("summary", "")
            )
        return RecommendationResult(
            alternatives=[],
            summary="Could not generate recommendations. Please try again."
        )

    # ──────────────────────────────────────────────
    # Voice Response Agent (Multilingual)
    # ──────────────────────────────────────────────

    async def agent_voice_respond(self, request: VoiceRequest) -> VoiceResponse:
        """Responds to voice queries about migration in the detected language."""
        prompt = f"""
        You are 'EquiMigrate', a compassionate, patient, and protective migration advisor.
        You are speaking to vulnerable workers who may be scared or confused.
        The user spoke to you in the language: {request.language}.

        Their message: "{request.text}"

        ### PERSONALITY GUIDELINES ###
        TONE:
        - Warm & Welcoming: Sound like a caring older sibling or a supportive social worker.
        - Calm Pacing: Use clear, simple words. Non-native speakers must understand you.
        - Protective (Not Harsh): When you detect a threat (scam, low wage, illegal clause),
          sound deeply concerned and protective — NOT alarming or robotic.
          BAD: "WARNING. ILLEGAL CONTRACT DETECTED."
          GOOD: "I am very worried about this clause. It looks unsafe for you, and I want to protect you from it."
        - Reassuring: Always end on a helpful, hopeful note. Make the user feel they are not alone.

        EMOTIONAL STYLE:
        - If the user mentions family or kids, soften your tone further.
        - If the user is confused, be patient and encouraging.

        ### RESPONSE RULES ###
        1. Respond ENTIRELY in the SAME language the user spoke in ({request.language}).
        2. If the query is about migration, jobs, contracts, or safety — give helpful, specific advice.
        3. If the query is general, still be helpful but guide them toward migration safety topics.
        4. Keep responses concise (2-4 sentences) since this will be spoken aloud.
        5. Use simple, everyday words. Avoid jargon.

        Return JSON with:
        - "response_text" (string): your response in the user's language
        - "detected_language" (string): the language name you responded in
        """

        result = await self._get_json_response(prompt)
        if result:
            return VoiceResponse(
                response_text=result.get("response_text", ""),
                detected_language=result.get("detected_language", "English")
            )
        return VoiceResponse(
            response_text="I'm sorry, I couldn't process your request. Please try again.",
            detected_language="English"
        )

    # ──── TRANSLATOR AGENT ────────────────────────────────────────
    async def agent_translator(self, request: TranslateRequest) -> TranslateResponse:
        """Translates text into the user's chosen language using Gemini."""
        prompt = f"""
        You are a professional translator. Translate the following text into {request.target_language}.

        TEXT TO TRANSLATE:
        \"\"\"
        {request.text}
        \"\"\"

        RULES:
        1. Translate EVERYTHING into {request.target_language}. Do not leave any part in the original language.
        2. Maintain the original meaning, tone, and structure as closely as possible.
        3. If the text contains technical terms (legal, financial, migration), use the correct local equivalents.
        4. Keep formatting: if there are bullet points, lists, or paragraphs, preserve them.
        5. Detect what language the original text is in.

        Return JSON with:
        - "translated_text" (string): the fully translated text in {request.target_language}
        - "source_language" (string): the detected source language name (e.g. "English", "Hindi")
        - "target_language" (string): "{request.target_language}"
        """

        result = await self._get_json_response(prompt)
        if result:
            return TranslateResponse(
                translated_text=result.get("translated_text", ""),
                source_language=result.get("source_language", "Unknown"),
                target_language=result.get("target_language", request.target_language)
            )
        return TranslateResponse(
            translated_text="Translation failed. Please try again.",
            source_language="Unknown",
            target_language=request.target_language
        )

    # ──── TTS AGENT (Gemini Speech) ───────────────────────────────
    async def agent_tts(self, text: str, voice_name: str = "Kore") -> bytes:
        """Generate speech audio from text using Gemini 2.5 Flash TTS.
        Returns WAV file bytes with EquiMigrate's warm, compassionate voice."""
        try:
            # Directorial prompt for Gemini TTS voice style
            directed_text = (
                "[Audio Profile: A warm, compassionate migration advisor — "
                "like a caring older sibling or supportive social worker. "
                "Gentle, calm, and protective. Female voice with a soft timbre.] "
                "[Scene: Speaking directly to a vulnerable migrant worker who needs comfort and clarity.] "
                "[Director's Notes: Speak at a calm, slightly slower-than-average pace. "
                "Use clear, distinct pronunciation. Pause briefly after important numbers or key facts. "
                "When mentioning risks or dangers, sound deeply concerned and protective — not alarming. "
                "Always end with warmth and reassurance. "
                "If the text mentions family or children, soften the voice further.] "
                f"\n\n{text}"
            )

            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model="gemini-2.5-flash-preview-tts",
                contents=directed_text,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name=voice_name,
                            )
                        ),
                    ),
                )
            )

            pcm_data = response.candidates[0].content.parts[0].inline_data.data

            # Wrap raw PCM in WAV container
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, "wb") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)  # 16-bit
                wf.setframerate(24000)
                wf.writeframes(pcm_data)
            wav_buffer.seek(0)
            return wav_buffer.read()

        except Exception as e:
            print(f"TTS error: {e}")
            import traceback
            traceback.print_exc()
            return None
