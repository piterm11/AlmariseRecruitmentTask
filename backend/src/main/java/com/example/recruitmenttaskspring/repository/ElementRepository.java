package com.example.recruitmenttaskspring.repository;

import com.example.recruitmenttaskspring.entity.Element;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public interface ElementRepository extends JpaRepository<Element,Long> {
    @Query("SELECT e.businessKey FROM Element e")
    List<String> findAllKeys();

    Optional<Element> findByBusinessKey(String businessKey);
}
