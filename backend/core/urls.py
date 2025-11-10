from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from .auth_views import (
    CustomTokenObtainPairView,
    LoginView,
    LogoutView,
    RegisterView,
    UserProfileView,
    check_auth,
    user_colegios,
)
from .views import (  # ViewSets del sistema de protocolos y anonimato; Views para gestión de usuarios
    AccesoIdentidadViewSet,
    ColegioViewSet,
    EjecucionEtapaViewSet,
    EtapaProtocoloViewSet,
    EvidenceViewSet,
    GraphsView,
    IncidentReportViewSet,
    MedidaFormativaViewSet,
    PerfilUsuarioViewSet,
    ProcesoIncidenteViewSet,
    ProtocoloProcesoViewSet,
    ReglasAnonimatoViewSet,
    ResolucionIncidenteViewSet,
    SancionViewSet,
    TipoIncidenteViewSet,
    UpdateUserColegioView,
)

router = routers.DefaultRouter()
router.register(r"colegios", ColegioViewSet)
router.register(r"reportes", IncidentReportViewSet)
router.register(r"evidencias", EvidenceViewSet)
router.register(r"tipos-incidente", TipoIncidenteViewSet)
router.register(r"usuarios", PerfilUsuarioViewSet)
router.register(r"medidas-formativas", MedidaFormativaViewSet)
router.register(r"sanciones", SancionViewSet)
router.register(r"resoluciones", ResolucionIncidenteViewSet)

# Endpoints del sistema de protocolos y anonimato
router.register(r"protocolos-proceso", ProtocoloProcesoViewSet)
router.register(r"etapas-protocolo", EtapaProtocoloViewSet)
router.register(r"procesos-incidente", ProcesoIncidenteViewSet)
router.register(r"ejecuciones-etapa", EjecucionEtapaViewSet)
router.register(r"reglas-anonimato", ReglasAnonimatoViewSet)
router.register(r"accesos-identidad", AccesoIdentidadViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # Endpoint para métricas y dashboards
    path("graphs/", GraphsView.as_view(), name="graphs"),
    # Endpoints de autenticación JWT
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/profile/", UserProfileView.as_view(), name="user-profile"),
    path("auth/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/colegios/", user_colegios, name="user-colegios"),
    path("auth/check/", check_auth, name="check-auth"),
    # Endpoint para actualizar colegio asignado
    path(
        "usuarios/<int:user_id>/colegio/",
        UpdateUserColegioView.as_view(),
        name="update-user-colegio",
    ),
]
