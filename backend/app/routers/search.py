from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.models.search import SearchResponse
from app.services.auth_service import get_current_user
from app.services.search_service import search_records


router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=SearchResponse)
def get_search_results(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SearchResponse:
    return search_records(db, query, current_user)
