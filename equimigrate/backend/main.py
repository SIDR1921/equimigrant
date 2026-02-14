from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from models import (
    JobOffer, AnalysisResult,
    ContractScanRequest, ContractScanResult,
    NegotiationRequest, NegotiationResult,
    RecommendationRequest, RecommendationResult,
    VoiceRequest, VoiceResponse,
    TranslateRequest, TranslateResponse,
    TTSRequest
)
from agents import SwarmOrchestrator
import os

app = FastAPI(title="EquiMigrate Swarm API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo, allow all. In prod, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = SwarmOrchestrator()

@app.post("/analyze-migration", response_model=AnalysisResult)
async def analyze_migration(offer: JobOffer):
    try:
        result = await orchestrator.analyze_offer(offer)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scan-contract", response_model=ContractScanResult)
async def scan_contract(request: ContractScanRequest):
    """Scan a contract image (handwritten or printed, any language) using Gemini Vision."""
    try:
        result = await orchestrator.agent_contract_scanner(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/negotiate", response_model=NegotiationResult)
async def negotiate_contract(request: NegotiationRequest):
    """Generate negotiation strategies for a contract."""
    try:
        result = await orchestrator.agent_negotiator(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend", response_model=RecommendationResult)
async def get_recommendations(request: RecommendationRequest):
    """Get better migration alternatives based on current offer analysis."""
    try:
        result = await orchestrator.agent_recommender(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/voice-respond", response_model=VoiceResponse)
async def voice_respond(request: VoiceRequest):
    """Respond to a voice query in the same language the user spoke."""
    try:
        result = await orchestrator.agent_voice_respond(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """Translate text into the user's preferred language using Gemini."""
    try:
        result = await orchestrator.agent_translator(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """Generate speech audio from text using Gemini TTS."""
    try:
        wav_bytes = await orchestrator.agent_tts(request.text, request.voice_name)
        if wav_bytes is None:
            raise HTTPException(status_code=500, detail="TTS generation failed")
        return Response(content=wav_bytes, media_type="audio/wav")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "EquiMigrate Swarm Active"}
