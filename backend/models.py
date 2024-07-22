from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import logging
from typing import List
from datetime import datetime, timezone

from sqlalchemy import  create_engine, UniqueConstraint, Integer, String, ForeignKey
from sqlalchemy.orm import DeclarativeBase,Mapped, mapped_column, sessionmaker, relationship
from werkzeug.security import generate_password_hash, check_password_hash

class Base(DeclarativeBase):
  def __repr__(self):
    return f"{self.__class__.__name__}(id={self.id})"
  
db = SQLAlchemy(model_class=Base)


class Designation(Base):
    __tablename__ = "designation"
    _table_args_  =(UniqueConstraint('role'),)
    id : Mapped[int] = mapped_column(primary_key=True)
    role : Mapped[str] = mapped_column(String(50))
    total_leave : Mapped[int] =mapped_column()
    employee: Mapped[List['Employee']] = relationship('Employee', back_populates='designation', cascade="all, delete-orphan")


class Employee(Base):
    __tablename__ = "employees"
    _table_args_ = (UniqueConstraint('phone_number' , 'email'),)
    id : Mapped[int] = mapped_column(primary_key=True)
    first_name : Mapped[str] = mapped_column(String(50))
    last_name : Mapped[str] = mapped_column(String(50))
    email : Mapped[str] = mapped_column(String(50))
    phone_number : Mapped[str] = mapped_column(String(30))
    address : Mapped[str] = mapped_column(String(100))
    designation_id : Mapped[int] = mapped_column(ForeignKey('designation.id'))
    designation: Mapped['Designation'] = relationship('Designation', back_populates='employee')
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc),nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now())
    deleted_at: Mapped[datetime] = mapped_column(nullable=True)    
    leaves = relationship('Leave', uselist=False, back_populates='employees',cascade="all, delete-orphan")    

class Leave(Base):
   __tablename__ = 'leave_management'
   _table_args_ = (UniqueConstraint('employee_id'),)
   id : Mapped[int] = mapped_column(primary_key=True)
   leave_taken : Mapped[int] = mapped_column()
   employee_id : Mapped[int] = mapped_column(ForeignKey('employees.id'))
   employees =relationship('Employee', back_populates='leaves')


class Authentication(db.Model):
    __tablename__ = 'hr_authentication'
    _table_args_ = (UniqueConstraint('username', '_password'),)
    id : Mapped[int] = mapped_column(primary_key=True)
    username: 'Mapped[str]' = mapped_column(String(50), nullable=False)
    _password: 'Mapped[str]' = mapped_column('password', String(128), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self._password=password



def init_db(db_uri='postgresql://postgres:postgres@localhost:5432/hrms'):
    logger = logging.getLogger("FlaskApp")
    engine = create_engine(db_uri)
    Base.metadata.create_all(engine)
    logger.info("Created database")

# def init_db(db_uri='postgresql://postgres:postgres@localhost:5432/hrms_sample'):
#     logger = logging.getLogger("FlaskApp")
#     engine = create_engine(db_uri)
#     Base.metadata.create_all(engine)
#     logger.info("Created database")

def get_session(db_uri):
    engine = create_engine(db_uri)
    Session = sessionmaker(bind = engine)
    session = Session()
    return session