package com.typingtrainer.typing.repository;

import com.typingtrainer.typing.entity.TypingSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TypingSessionRepository extends JpaRepository<TypingSessionEntity, UUID> {
}