from authlib.integrations.starlette_client import OAuth
from app.core.config import settings

oauth = OAuth()

# Google OAuth 클라이언트 설정
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:8000/auth/google/callback',
    client_kwargs={'scope': 'openid email profile'},
)
