package com.example.recruitmenttaskspring.job;

import com.example.recruitmenttaskspring.repository.ElementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecordCounterJob {

    private final ElementRepository repository;

    @Scheduled(cron = "0 * * * * *")
    @SchedulerLock(name = "RecordCounterJob_count", lockAtLeastFor = "15s", lockAtMostFor = "30s")
    public void count() {
        long count = repository.count();
        log.info("[CRON] Total records in DB: {}", count);
    }
}
