package com.typingtrainer.common.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record PagedResponse<T>(
        List<T> items,
        int page,
        int size,
        long totalItems,
        int totalPages
) {
    public static <T> PagedResponse<T> from(Page<T> springPage) {
        return new PagedResponse<>(
                springPage.getContent(),
                springPage.getNumber(),
                springPage.getSize(),
                springPage.getTotalElements(),
                springPage.getTotalPages()
        );
    }
}
