package com.example.recruitmenttaskspring.dto;

import java.io.Serializable;


public record ElementDto(String businessKey, String content) implements Serializable {
}