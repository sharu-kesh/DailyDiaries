package com.dailydiaries.service;

import com.dailydiaries.entity.Blog;
import com.dailydiaries.repository.BlogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BlogService {
    private static final Logger logger = LoggerFactory.getLogger(BlogService.class);
    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public Page<Blog> findBlogsByUserIds(List<Long> userIds, PageRequest pageRequest) {
        return blogRepository.findByUserIdIn(userIds, pageRequest);
    }

    public Blog createBlog(String title, String content, Long userId) {
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setContent(content);
        blog.setUserId(userId);
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
}