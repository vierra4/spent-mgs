"""Python FastAPI main entrance"""

from fastapi import FastAPI
from fastapi_plugin.fast_api_client import Auth0FastAPI
from auth.config import get_settings
from routes import users,spends,approvals,receipts, events, notifications, audit_logs, policies, admins
from fastapi.middleware.cors import CORSMiddleware
from db import init_db, close_db
from contextlib import asynccontextmanager
from models.models import Category, User, Organization, IdempotencyKey
import bcrypt
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Everything before 'yield' runs on startup
    await init_db()
    yield
    # Everything after 'yield' runs on shutdown
    await close_db()
# Creates app instance
app = FastAPI(lifespan=lifespan)
# AddCORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


settings = get_settings()
auth0 = Auth0FastAPI(
   domain=settings.auth0_domain,
   audience=settings.auth0_api_audience
)

app.include_router(users.router)
app.include_router(spends.router)
app.include_router(approvals.router)
app.include_router(receipts.router)
app.include_router(events.router)
app.include_router(policies.router)
app.include_router(audit_logs.router)
app.include_router(notifications.router)
app.include_router(admins.router)

@app.get("/")
def public():
   """No access token required to access this route"""

   result = {
       "status": "success",
       "msg": ("Hello from a public endpoint! You don't need to be "
               "authenticated to see this.")
   }
   return result

@app.get("/debug-orgs")
async def debug_orgs():
    return await Category.all().values()
@app.get("/debug-users")
async def debug_users():
    return await User.all().values()
# @app.get("/debug-orgs_users")
# async def debug_orgs_users ():
#     return await User.filter(org_id="")all().values()
if __name__ == "__main__":

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)