from fastapi import FastAPI
from .database import Base, engine
from .routers import health, events


Base.metadata.create_all(bind=engine)

app = FastAPI(title="BUSSENSE Backend")

app.include_router(health.router)
app.include_router(events.router)