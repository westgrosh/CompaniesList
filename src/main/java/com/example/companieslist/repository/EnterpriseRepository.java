package com.example.companieslist.repository;

import com.example.companieslist.model.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    // ... custom queries if needed ...
}