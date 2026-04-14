from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from db import get_db
from models import Note
from schemas.note import NoteCreate, NoteOut
from core.deps import get_current_user
from models import User

router = APIRouter(prefix="/notes", tags=["Notes"])


# -----------------------
# CREATE NOTE
# -----------------------
@router.post("/", response_model=NoteOut)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    new_note = Note(
        title=note.title,
        content=note.content,
        owner_id=user.id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


# -----------------------
# GET MY NOTES
# -----------------------
@router.get("/", response_model=list[NoteOut])
def get_notes(
    query: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    notes_query = db.query(Note).filter(Note.owner_id == user.id)
    
    if query:
        notes_query = notes_query.filter(
            (Note.title.contains(query)) | (Note.content.contains(query))
        )
    
    return notes_query.all()


# -----------------------
# UPDATE NOTE
# -----------------------
@router.put("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int,
    updated_note: NoteCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    note.title = updated_note.title
    note.content = updated_note.content

    db.commit()
    db.refresh(note)

    return note


# -----------------------
# DELETE NOTE
# -----------------------
@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(note)
    db.commit()

    return {"message": "Note deleted"}