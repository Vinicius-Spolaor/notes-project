package com.ensolvers.challenge.exception.advice;

import com.ensolvers.challenge.dto.ErrorDTO;
import com.ensolvers.challenge.exception.BusinessException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Objects;

@Slf4j
@ControllerAdvice
public class ResponseEntityAdvice {

    @ExceptionHandler({ BusinessException.class })
    protected ResponseEntity<?> handleBusinessException(BusinessException ex) {
        var errorDTO = new ErrorDTO();
        errorDTO.setCode(HttpStatus.BAD_REQUEST.value());
        errorDTO.setMessage(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorDTO.setReason(ex.getMessage());

        generateLogMessage(ex);
        return ResponseEntity.badRequest().body(errorDTO);
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class })
    protected ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        var errorMessage = Objects.isNull(ex.getFieldError())
                         ? ex.getMessage()
                         : String.format("Field %s %s", ex.getFieldError().getField(), ex.getFieldError().getDefaultMessage());

        var errorDTO = new ErrorDTO();

        errorDTO.setCode(HttpStatus.BAD_REQUEST.value());
        errorDTO.setMessage(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorDTO.setReason(errorMessage);

        generateLogMessage(ex);
        return ResponseEntity.badRequest().body(errorDTO);
    }

    @ExceptionHandler({ DataIntegrityViolationException.class })
    protected ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        var errorDTO = new ErrorDTO();

        errorDTO.setCode(HttpStatus.BAD_REQUEST.value());
        errorDTO.setMessage(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorDTO.setReason("Data integrity violation.");

        generateLogMessage(ex);
        return ResponseEntity.badRequest().body(errorDTO);
    }

    @ExceptionHandler({ UsernameNotFoundException.class })
    protected ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        var errorDTO = new ErrorDTO();

        errorDTO.setCode(HttpStatus.NOT_FOUND.value());
        errorDTO.setMessage(HttpStatus.NOT_FOUND.getReasonPhrase());
        errorDTO.setReason(ex.getMessage());

        generateLogMessage(ex);
        return new ResponseEntity<>(errorDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ BadCredentialsException.class })
    protected ResponseEntity<?> handleBadCredentialsException(BadCredentialsException ex) {
        var errorDTO = new ErrorDTO();

        errorDTO.setCode(HttpStatus.UNAUTHORIZED.value());
        errorDTO.setMessage(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorDTO.setReason("Invalid username or password.");

        generateLogMessage(ex);
        return new ResponseEntity<>(errorDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({ SignatureException.class })
    protected ResponseEntity<?> handleSignatureException(SignatureException ex) {
        var errorDTO = new ErrorDTO();

        errorDTO.setCode(HttpStatus.UNAUTHORIZED.value());
        errorDTO.setMessage(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorDTO.setReason(ex.getMessage());

        generateLogMessage(ex);
        return new ResponseEntity<>(errorDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({ Exception.class })
    protected ResponseEntity<?> handleDefaultException(Exception ex) {
        var errorDTO = new ErrorDTO();

        errorDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDTO.setMessage(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        errorDTO.setReason("Something went wrong. Please try again later");

        generateLogMessage(ex);
        return ResponseEntity.internalServerError().body(errorDTO);
    }

    private void generateLogMessage(Exception ex) {
        log.error("Error \"{}\" coming from: {}", ex.getMessage(), ex.getStackTrace());
    }
}
