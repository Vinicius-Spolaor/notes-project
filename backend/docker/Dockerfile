# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the application JAR file into the container at /app
COPY target/ensolvers-backend.jar /app/ensolvers-backend.jar

# Expose the port that your application will run on
EXPOSE 8080

# Run the application when the container starts
ENTRYPOINT ["java", "-jar", "/app/ensolvers-backend.jar"]
