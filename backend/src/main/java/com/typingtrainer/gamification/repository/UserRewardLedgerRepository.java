package com.typingtrainer.gamification.repository;

import com.typingtrainer.gamification.entity.UserRewardLedgerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRewardLedgerRepository extends JpaRepository<UserRewardLedgerEntity, String> {
    Optional<UserRewardLedgerEntity> findByRewardEventId(String rewardEventId);
}
