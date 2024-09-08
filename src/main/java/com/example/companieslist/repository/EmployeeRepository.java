package com.example.companieslist.repository;

import com.example.companieslist.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // all crud data methods
    List<Employee> findAllByEnterpriseId(Long enterpriseId);
}
