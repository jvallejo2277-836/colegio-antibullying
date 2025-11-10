from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Colegio
from .serializers import (
    ColegioSerializer,
    CustomUserSerializer,
    LoginSerializer,
    UserProfileSerializer,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer para JWT tokens con información del usuario"""

    def validate(self, attrs):
        data = super().validate(attrs)

        # Agregar información del usuario al response
        data.update(
            {
                "user": {
                    "id": self.user.id,
                    "username": self.user.username,
                    "email": self.user.email,
                    "first_name": self.user.first_name,
                    "last_name": self.user.last_name,
                    "role": self.user.role,
                    "role_display": self.user.get_role_display(),
                    "colegio": self.user.colegio.id if self.user.colegio else None,
                    "colegio_name": (
                        self.user.colegio.nombre if self.user.colegio else None
                    ),
                    "telefono": self.user.telefono,
                    "rut": self.user.rut,
                }
            }
        )
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom view para obtener tokens JWT"""

    serializer_class = CustomTokenObtainPairSerializer


class LoginView(APIView):
    """Vista para login con JWT"""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "role": user.role,
                        "role_display": user.get_role_display(),
                        "colegio": user.colegio.id if user.colegio else None,
                        "colegio_name": user.colegio.nombre if user.colegio else None,
                        "telefono": user.telefono,
                        "rut": user.rut,
                    },
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Vista para logout con JWT"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logout exitoso"}, status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {"error": "Error al cerrar sesión"}, status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(APIView):
    """Vista para obtener y actualizar perfil del usuario"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """Vista para registro de usuarios"""

    permission_classes = [permissions.AllowAny]  # Cambiar según necesidades

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserProfileSerializer(user).data,
                    "message": "Usuario creado exitosamente",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def user_colegios(request):
    """Obtener colegios disponibles para el usuario actual"""
    user = request.user

    if user.role == "admin":
        # Admin puede ver todos los colegios
        colegios = Colegio.objects.all()
    elif user.role == "sostenedor":
        # Sostenedor puede ver colegios de su red (por ahora todos)
        colegios = Colegio.objects.all()
    else:
        # Director y encargado solo su colegio
        if user.colegio:
            colegios = Colegio.objects.filter(id=user.colegio.id)
        else:
            colegios = Colegio.objects.none()

    serializer = ColegioSerializer(colegios, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def check_auth(request):
    """Verificar estado de autenticación"""
    if request.user.is_authenticated:
        return Response(
            {"authenticated": True, "user": UserProfileSerializer(request.user).data}
        )
    return Response({"authenticated": False, "user": None})
