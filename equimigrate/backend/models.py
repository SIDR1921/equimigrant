from pydantic import BaseModel
from typing import List, Dict, Optional

class JobOffer(BaseModel):
    origin: str
    destination: str
    job_description: str
    salary: str
    offer_text: str

class AnalysisResult(BaseModel):
    legal_risk: int  # 0-100
    economic_verdict: str
    culture_shocks: List[str]
    living_conditions: Dict[str, str] # Healthcare, Education, Housing, Safety
    final_advice: str
    hidden_costs: List[str]

# --- Contract Scanning ---
class ContractScanRequest(BaseModel):
    image_data: str  # base64-encoded image
    file_name: Optional[str] = "contract.jpg"

class ContractScanResult(BaseModel):
    extracted_text: str
    detected_language: str
    red_flags: List[str]
    negotiation_points: List[str]
    summary: str

# --- Negotiation ---
class NegotiationRequest(BaseModel):
    contract_text: str
    user_concerns: str
    detected_language: Optional[str] = "English"

class NegotiationResult(BaseModel):
    original_issues: List[str]
    suggested_changes: List[str]
    negotiation_script: str
    risk_reduction: str

# --- Recommendations ---
class RecommendationRequest(BaseModel):
    origin: str
    destination: str
    job_description: str
    salary: str
    legal_risk: Optional[int] = None

class RecommendationItem(BaseModel):
    destination: str
    role: str
    salary_range: str
    why_better: str
    safety_score: str

class RecommendationResult(BaseModel):
    alternatives: List[RecommendationItem]
    summary: str

# --- Voice ---
class VoiceRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class VoiceResponse(BaseModel):
    response_text: str
    detected_language: str

# --- Translation ---
class TranslateRequest(BaseModel):
    text: str
    target_language: str

class TranslateResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str

# --- TTS (Gemini Speech) ---
class TTSRequest(BaseModel):
    text: str
    voice_name: Optional[str] = "Kore"
