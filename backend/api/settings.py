from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import get_db_context
from db.models import Setting

router = APIRouter(prefix="/api/settings", tags=["settings"])

class SettingRequest(BaseModel):
    key: str
    value: str

@router.get("")
async def get_settings():
    with get_db_context() as db:
        settings = db.query(Setting).all()
        return {s.key: s.value for s in settings}

@router.put("")
async def update_setting(req: SettingRequest):
    with get_db_context() as db:
        setting = db.query(Setting).filter(Setting.key == req.key).first()
        if setting:
            setting.value = req.value
        else:
            setting = Setting(key=req.key, value=req.value)
            db.add(setting)
        db.commit()
        return {"status": "ok"}

@router.get("/{key}")
async def get_setting(key: str):
    with get_db_context() as db:
        setting = db.query(Setting).filter(Setting.key == key).first()
        if not setting:
            raise HTTPException(status_code=404, detail="Setting not found")
        return {"key": setting.key, "value": setting.value}
