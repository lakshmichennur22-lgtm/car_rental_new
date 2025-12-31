package com.property.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.property.property.model.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
}
