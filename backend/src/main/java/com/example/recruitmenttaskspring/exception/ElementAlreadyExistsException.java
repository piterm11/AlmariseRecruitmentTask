package com.example.recruitmenttaskspring.exception;

public class ElementAlreadyExistsException extends RuntimeException {
    public ElementAlreadyExistsException(String businessKey) {
        super("Element with key " + businessKey + " already exists");
    }
}
