package com.typingtrainer.gamification.repository;

import com.typingtrainer.gamification.entity.UserGamificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserGamificationRepository extends JpaRepository<UserGamificationEntity, UUID> {
}
