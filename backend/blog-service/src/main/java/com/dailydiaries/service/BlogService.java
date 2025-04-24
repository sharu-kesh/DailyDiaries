package com.dailydiaries.service;

import com.dailydiaries.entity.Blog;
import com.dailydiaries.entity.User;
import com.dailydiaries.repository.BlogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

    private static final Logger logger = LoggerFactory.getLogger(BlogService.class);

    private final BlogRepository blogRepository;
    private final RestTemplate restTemplate;

    public BlogService(BlogRepository blogRepository, RestTemplate restTemplate) {
        this.blogRepository = blogRepository;
        this.restTemplate = restTemplate;
    }

    public Blog createBlog(Blog blog, Long userId) {
        logger.debug("Creating blog for userId: {}", userId);
        blog.setUserId(userId);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setLikeCount(0L);
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id, Long userId) {
        logger.debug("Deleting blog with id: {} for userId: {}", id, userId);
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Blog not found for id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");
                });

        if (!blog.getUserId().equals(userId)) {
            logger.warn("User {} is not authorized to delete blog {}", userId, id);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this blog");
        }

        blogRepository.delete(blog);
        logger.info("Blog {} deleted successfully", id);
    }

    public Page<BlogResponse> getBlogsByUserIds(List<Long> userIds, Pageable pageable) {
        logger.debug("Fetching blogs for userIds: {}", userIds);
        Page<Blog> blogs = blogRepository.findByUserIdIn(userIds, pageable);
        List<BlogResponse> blogResponses = blogs.getContent().stream()
                .map(blog -> {
                    User user = restTemplate.getForObject(
                            "http://localhost:8081/api/v2/users/" + blog.getUserId(),
                            User.class
                    );
                    String username = user != null ? user.getUsername() : "Unknown";
                    return new BlogResponse(
                            blog.getId(),
                            blog.getTitle(),
                            blog.getSubtitle(),
                            blog.getTitleImage(),
                            blog.getContent(),
                            blog.getUserId(),
                            username,
                            blog.getCreatedAt(),
                            blog.getLikeCount()
                    );
                })
                .collect(Collectors.toList());
        return new PageImpl<>(blogResponses, pageable, blogs.getTotalElements());
    }

    public long getBlogCountByUserId(Long userId) {
        logger.debug("Fetching Blog count for UserId: {}", userId);
        return blogRepository.countByUserId(userId);
    }
}