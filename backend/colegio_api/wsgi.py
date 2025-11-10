import os

from django.core.wsgi import get_wsgi_application

# Apply runtime patches early
try:
    # Importing this module applies small compatibility monkeypatches
    # (idempotent and safe) so we avoid editing site-packages.
    import colegio_api.patches  # noqa: F401
except Exception:
    # If the patch module fails for any reason, continue without it
    pass

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "colegio_api.settings")

application = get_wsgi_application()
