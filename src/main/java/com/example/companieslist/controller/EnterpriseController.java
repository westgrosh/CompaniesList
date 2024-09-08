package com.example.companieslist.controller;

import com.example.companieslist.dto.EmployeeDto;
import com.example.companieslist.dto.EnterpriseDto;
import com.example.companieslist.exception.ResourceNotFoundException;
import com.example.companieslist.model.Employee;
import com.example.companieslist.model.Enterprise;
import com.example.companieslist.repository.EmployeeRepository;
import com.example.companieslist.repository.EnterpriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enterprises")
public class EnterpriseController {

    @Autowired
    private EnterpriseRepository enterpriseRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<EnterpriseDto> getAllEnterprises() {
        return enterpriseRepository.findAll().stream()
                .map(this::convertToEnterpriseDto)
                .collect(Collectors.toList());
    }

    private EnterpriseDto convertToEnterpriseDto(Enterprise enterprise) {
        EnterpriseDto enterpriseDto = new EnterpriseDto();
        enterpriseDto.setId(enterprise.getId());
        enterpriseDto.setName(enterprise.getName());
        enterpriseDto.setEmployees(enterprise.getEmployees().stream()
                .map(this::convertToEmployeeDto)
                .collect(Collectors.toList()));
        return enterpriseDto;
    }

    private EmployeeDto convertToEmployeeDto(Employee employee) {
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setId(employee.getId());
        employeeDto.setFirstName(employee.getFirstName());
        employeeDto.setLastName(employee.getLastName());
        employeeDto.setPost(employee.getPost());
        employeeDto.setEnterpriseId(employee.getEnterprise().getId());
        return employeeDto;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enterprise> getEnterpriseById(@PathVariable Long id) {
        Optional<Enterprise> enterprise = enterpriseRepository.findById(id);
        return enterprise.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Enterprise createEnterprise(@RequestBody Enterprise enterprise) {
        return enterpriseRepository.save(enterprise);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enterprise> updateEnterprise(@PathVariable Long id, @RequestBody Enterprise updatedEnterprise) {
        Optional<Enterprise> enterprise = enterpriseRepository.findById(id);
        if (enterprise.isPresent()) {
            Enterprise existingEnterprise = enterprise.get();
            existingEnterprise.setName(updatedEnterprise.getName());
            return ResponseEntity.ok(enterpriseRepository.save(existingEnterprise));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnterprise(@PathVariable Long id) {
        Optional<Enterprise> enterprise = enterpriseRepository.findById(id);
        if (enterprise.isPresent()) {
            enterpriseRepository.delete(enterprise.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Получить всех сотрудников для конкретного предприятия
    @GetMapping("/{id}/employees")
    public List<Employee> getEmployeesByEnterpriseId(@PathVariable Long id) {
        Optional<Enterprise> enterprise = enterpriseRepository.findById(id);
        if (enterprise.isPresent()) {
            return employeeRepository.findAllByEnterpriseId(enterprise.get().getId());
        } else {
            throw new ResourceNotFoundException("Enterprise not found with id: " + id);
        }
    }

}
