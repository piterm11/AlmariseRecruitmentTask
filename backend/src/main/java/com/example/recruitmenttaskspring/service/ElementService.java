package com.example.recruitmenttaskspring.service;

import com.example.recruitmenttaskspring.dto.CreateElementCommand;
import com.example.recruitmenttaskspring.dto.ElementDto;
import com.example.recruitmenttaskspring.entity.Element;
import com.example.recruitmenttaskspring.exception.ElementAlreadyExistsException;
import com.example.recruitmenttaskspring.repository.ElementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElementService {

    private final ElementRepository repository;

    public ElementDto create(CreateElementCommand cmd) {
        String username = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Principal::getName)
                .orElse("Anonymous");
        log.info("User {} is creating element: {}", username, cmd.businessKey());

        Element element = new Element();
        element.setBusinessKey(cmd.businessKey());
        element.setContent(cmd.content());

        try {
            Element saved = repository.save(element);
            return mapToDto(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ElementAlreadyExistsException("Element with key " + cmd.businessKey() + " already exists");
        }
    }

    @Cacheable(value = "elements", key = "#key")
    public ElementDto getByKey(String key) {
        log.info("Fetching from DB for key: {}", key);
        return repository.findByBusinessKey(key)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Element not found"));
    }

    public List<String> getAllKeys() {
        return repository.findAllKeys();
    }

    private ElementDto mapToDto(Element e) {
        return new ElementDto(e.getBusinessKey(), e.getContent());
    }
}