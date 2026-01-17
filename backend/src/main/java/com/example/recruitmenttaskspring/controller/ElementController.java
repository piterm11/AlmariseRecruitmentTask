package com.example.recruitmenttaskspring.controller;

import com.example.recruitmenttaskspring.dto.CreateElementCommand;
import com.example.recruitmenttaskspring.dto.ElementDto;
import com.example.recruitmenttaskspring.service.ElementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elements")
@RequiredArgsConstructor
public class ElementController {

    private final ElementService service;

    @PostMapping
    public ResponseEntity<ElementDto> create(@RequestBody @Valid CreateElementCommand cmd) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(cmd));
    }

    @GetMapping("/{key}")
    public ResponseEntity<ElementDto> get(@PathVariable String key) {
        return ResponseEntity.ok(service.getByKey(key));
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAll() {
        return ResponseEntity.ok(service.getAllKeys());
    }
}