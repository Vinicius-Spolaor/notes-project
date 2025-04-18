package com.ensolvers.challenge.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ErrorDTO {
    private int code;
    private String message;
    private String reason;
}
