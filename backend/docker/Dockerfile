FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY ../../backend /app

RUN chmod +x /app/mvnw

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
