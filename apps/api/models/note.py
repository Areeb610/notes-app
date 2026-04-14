from sqlalchemy import Column, Integer, String, ForeignKey
from db import Base
from sqlalchemy.orm import relationship


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="notes")