package com.example.recruitmenttaskspring.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateElementCommand(
        @NotBlank String businessKey,
        String content
) {
}