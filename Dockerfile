# Build stage for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Build stage for backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY TodoApi/*.csproj ./TodoApi/
RUN dotnet restore TodoApi/TodoApi.csproj
COPY TodoApi/ ./TodoApi/
RUN dotnet build TodoApi/TodoApi.csproj -c Release -o /app/build

# Publish stage
FROM backend-build AS publish
RUN dotnet publish TodoApi/TodoApi.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=frontend-build /app/dist ./wwwroot
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TodoApi.dll"]