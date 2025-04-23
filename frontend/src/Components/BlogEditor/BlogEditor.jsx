import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaBold, FaItalic, FaListUl, FaListOl, FaQuoteRight, 
  FaImage, FaVideo, FaLink, FaUndo, FaRedo, FaEllipsisH,
  FaPalette 
} from 'react-icons/fa';
import { MdFormatSize } from 'react-icons/md';
import './BlogEditor.css';

function BlogEditor() {
  const editorRef = useRef(null);
  const titleImageInputRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const [showHeadingOptions, setShowHeadingOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [readTime, setReadTime] = useState("0 min read");
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Common colors for text
  const colorOptions = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#333333' },
    { name: 'Gray', value: '#666666' },
    { name: 'Light Gray', value: '#999999' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#FFA500' },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    const savedBlog = localStorage.getItem('blogDraft');
    if (savedBlog) {
      const { title, subtitle, titleImage, content } = JSON.parse(savedBlog);
      document.getElementById('title').value = title || '';
      document.getElementById('subtitle').value = subtitle || '';
      if (titleImage) {
        updateHeroImage(titleImage);
      }
      if (content) {
        editorRef.current.innerHTML = content;
        updateWordCountAndReadTime(content);
      }
    }
  }, []);

  // Add click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHeadingOptions && !event.target.closest('.medium-toolbar-dropdown')) {
        setShowHeadingOptions(false);
      }
      if (showColorOptions && !event.target.closest('.color-dropdown')) {
        setShowColorOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHeadingOptions, showColorOptions]);

  const updateWordCountAndReadTime = (content) => {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').filter(word => word.length > 0);
    const count = words.length;
    
    setWordCount(count);
    const minutes = Math.ceil(count / 200);
    setReadTime(`${minutes} min read`);
  };

  const updateHeroImage = (imageUrl) => {
    const heroContainer = document.querySelector('.hero-image-container');
    heroContainer.style.backgroundImage = `url(${imageUrl})`;
    heroContainer.style.height = '400px';
    heroContainer.classList.add('has-image');
  };

  const saveToLocalStorage = (title, subtitle, titleImage, content) => {
    const blogDraft = { title, subtitle, titleImage, content };
    localStorage.setItem('blogDraft', JSON.stringify(blogDraft));
  };

  const resizeImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedBase64);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleTitleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resizedBase64 = await resizeImage(file);
      updateHeroImage(resizedBase64);
      const title = document.getElementById('title').value;
      const subtitle = document.getElementById('subtitle').value;
      const content = editorRef.current.innerHTML;
      saveToLocalStorage(title, subtitle, resizedBase64, content);
    }
  };

  const handleContentImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resizedBase64 = await resizeImage(file);
      const img = `<figure class="medium-figure centered">
        <img src="${resizedBase64}" alt="Uploaded image" />
        <figcaption contenteditable="true" class="medium-caption" placeholder="Add a caption..." onfocus="this.placeholder=''" onblur="this.placeholder='Add a caption...'"></figcaption>
      </figure>`;
      insertAtCursor(img);
    }
  };

  const insertAtCursor = (html) => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    let range;

    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      range.deleteContents();
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const fragment = range.createContextualFragment(html);
    range.insertNode(fragment);
    const lastNode = fragment.lastChild || fragment;
    if (lastNode && lastNode.nodeType === Node.ELEMENT_NODE) {
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
    } else {
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const titleImage = document.querySelector('.hero-image-container').classList.contains('has-image') ? 
      document.querySelector('.hero-image-container').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
    const content = editorRef.current.innerHTML;
    updateWordCountAndReadTime(content);
    saveToLocalStorage(title, subtitle, titleImage, content);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const titleImage = document.querySelector('.hero-image-container').classList.contains('has-image') ? 
      document.querySelector('.hero-image-container').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
    const content = editorRef.current.innerHTML;
    updateWordCountAndReadTime(content);
    saveToLocalStorage(title, subtitle, titleImage, content);
  };

  const handleHeading = (level) => {
    const newTag = level === 'paragraph' ? 'p' : level;
    document.execCommand('formatBlock', false, newTag);
    editorRef.current.focus();
    setShowHeadingOptions(false);
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const titleImage = document.querySelector('.hero-image-container').classList.contains('has-image') ? 
      document.querySelector('.hero-image-container').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
    const content = editorRef.current.innerHTML;
    updateWordCountAndReadTime(content);
    saveToLocalStorage(title, subtitle, titleImage, content);
  };

  const handleFontColor = (color) => {
    execCommand('foreColor', color);
    setShowColorOptions(false);
  };

  const insertBlockquote = () => {
    document.execCommand('formatBlock', false, 'blockquote');
    editorRef.current.focus();
  };

  const insertUnorderedList = () => {
    if (document.queryCommandState('insertUnorderedList')) {
      execCommand('insertUnorderedList');
    } else {
      execCommand('insertUnorderedList');
      setTimeout(() => {
        const lists = editorRef.current.querySelectorAll('ul');
        lists.forEach(list => {
          if (!list.style.paddingLeft) {
            list.style.paddingLeft = '30px';
          }
          if (!list.style.listStyleType) {
            list.style.listStyleType = 'disc';
          }
        });
      }, 10);
    }
  };

  const insertOrderedList = () => {
    if (document.queryCommandState('insertOrderedList')) {
      execCommand('insertOrderedList');
    } else {
      execCommand('insertOrderedList');
      setTimeout(() => {
        const lists = editorRef.current.querySelectorAll('ol');
        lists.forEach(list => {
          if (!list.style.paddingLeft) {
            list.style.paddingLeft = '30px';
          }
          if (!list.style.listStyleType) {
            list.style.listStyleType = 'decimal';
          }
        });
      }, 10);
    }
  };

  const insertVideo = () => {
    const url = prompt('Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=example)');
    if (url) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n]+)/)?.[1];
      if (videoId) {
        const embed = `<figure class="medium-figure centered">
          <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          <figcaption contenteditable="true" class="medium-caption" placeholder="Add a caption..." onfocus="this.placeholder=''" onblur="this.placeholder='Add a caption...'"></figcaption>
        </figure>`;
        insertAtCursor(embed);
      } else {
        alert('Invalid YouTube URL');
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Enter the URL (e.g., https://example.com)');
    if (url) {
      const selection = window.getSelection();
      if (selection.toString()) {
        document.execCommand('createLink', false, url);
      } else {
        insertAtCursor(`<a href="${url}" target="_blank">${url}</a>`);
      }
      editorRef.current.focus();
    }
  };

  const handlePublish = async () => {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = editorRef.current.innerHTML;
    const titleImage = document.querySelector('.hero-image-container').classList.contains('has-image') ? 
      document.querySelector('.hero-image-container').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
    setIsPublishing(true);
    const blogData = { title, subtitle, titleImage, content };
    try {
      console.log(blogData)
      const response = await axios.post('http://localhost:8080/api/blogs', blogData);
      console.log('Blog published:', response.data);
      alert('Blog published successfully!');
      localStorage.removeItem('blogDraft');
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Failed to publish blog');
    } finally {
      localStorage.removeItem('blogDraft');
      setIsPublishing(false);
    }
  };

  const handleInputChange = () => {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const titleImage = document.querySelector('.hero-image-container').classList.contains('has-image') ? 
      document.querySelector('.hero-image-container').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
    const content = editorRef.current.innerHTML;
    updateWordCountAndReadTime(content);
    saveToLocalStorage(title, subtitle, titleImage, content);
  };

  const handleSaveDraft = () => {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const titleImage = document.querySelector('.hero-image-container').classList.contains('has-image') ? 
      document.querySelector('.hero-image-container').style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
    const content = editorRef.current.innerHTML;
    setIsSaving(true);
    saveToLocalStorage(title, subtitle, titleImage, content);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // Handle Enter key in caption to move to next line
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.target.className.includes('medium-caption')) {
        e.preventDefault();
        const caption = e.target;
        const range = document.createRange();
        range.selectNodeContents(caption);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('insertHTML', false, '<br><br>'); // Double <br> to ensure new line
        setTimeout(() => {
          const nextNode = caption.nextSibling;
          if (nextNode && nextNode.nodeName === 'BR') {
            range.setStartAfter(nextNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            editorRef.current.focus();
          }
        }, 0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="medium-editor-container">
      <div className="medium-editor-nav">
        <div className="medium-editor-stats">
          <span>{wordCount} words</span>
          <span>{readTime}</span>
        </div>
      </div>

      <div className="medium-editor-content">
        <div 
          className="hero-image-container"
          onClick={() => titleImageInputRef.current.click()}
        >
          <div className="hero-image-overlay">
            <FaImage className="hero-image-icon" />
            <span>Add a cover image</span>
          </div>
          <input
            type="file"
            ref={titleImageInputRef}
            accept="image/*"
            onChange={handleTitleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="medium-editor-body">
          <input
            type="text"
            id="title"
            placeholder="Title"
            className="medium-title-input"
            onChange={handleInputChange}
          />
          
          <input
            type="text"
            id="subtitle"
            placeholder="Subtitle"
            className="medium-subtitle-input"
            onChange={handleInputChange}
          />

          <div className="medium-toolbar">
            <button onClick={() => execCommand('bold')} title="Bold (Ctrl+B)" className="medium-toolbar-btn">
              <FaBold />
            </button>
            <button onClick={() => execCommand('italic')} title="Italic (Ctrl+I)" className="medium-toolbar-btn">
              <FaItalic />
            </button>
            <div className="medium-toolbar-dropdown">
              <button 
                onClick={() => setShowHeadingOptions(!showHeadingOptions)} 
                title="Text style" 
                className="medium-toolbar-btn"
              >
                <MdFormatSize />
              </button>
              {showHeadingOptions && (
                <div className="medium-heading-options">
                  <button onClick={() => handleHeading('h1')} className="medium-heading-option">Heading 1</button>
                  <button onClick={() => handleHeading('h2')} className="medium-heading-option">Heading 2</button>
                  <button onClick={() => handleHeading('h3')} className="medium-heading-option">Heading 3</button>
                  <button onClick={() => handleHeading('paragraph')} className="medium-heading-option">Paragraph</button>
                </div>
              )}
            </div>
            <div className="medium-toolbar-dropdown color-dropdown">
              <button 
                onClick={() => setShowColorOptions(!showColorOptions)} 
                title="Font Color" 
                className="medium-toolbar-btn"
              >
                <FaPalette />
              </button>
              {showColorOptions && (
                <div className="medium-heading-options">
                  {colorOptions.map((color, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleFontColor(color.value)} 
                      className="medium-heading-option color-option"
                      style={{display: 'flex', alignItems: 'center'}}
                    >
                      <span 
                        style={{
                          display: 'inline-block', 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: color.value, 
                          marginRight: '8px',
                          borderRadius: '2px'
                        }}
                      ></span>
                      {color.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={insertBlockquote} title="Quote" className="medium-toolbar-btn">
              <FaQuoteRight />
            </button>
            <button onClick={insertUnorderedList} title="Bulleted List" className="medium-toolbar-btn">
              <FaListUl />
            </button>
            <button onClick={insertOrderedList} title="Numbered List" className="medium-toolbar-btn">
              <FaListOl />
            </button>
            <button onClick={() => contentImageInputRef.current.click()} title="Insert Image" className="medium-toolbar-btn">
              <FaImage />
            </button>
            <input 
              type="file" 
              ref={contentImageInputRef} 
              accept="image/*" 
              onChange={handleContentImageChange} 
              style={{ display: 'none' }} 
            />
            <button onClick={insertVideo} title="Insert Video" className="medium-toolbar-btn">
              <FaVideo />
            </button>
            <button onClick={insertLink} title="Insert Link" className="medium-toolbar-btn">
              <FaLink />
            </button>
            <button onClick={() => execCommand('undo')} title="Undo" className="medium-toolbar-btn">
              <FaUndo />
            </button>
            <button onClick={() => execCommand('redo')} title="Redo" className="medium-toolbar-btn">
              <FaRedo />
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="medium-editor-field"
            onInput={handleInputChange}
            placeholder="Tell your story..."
          />
        </div>

        <div className="medium-editor-footer">
          <button 
            onClick={handleSaveDraft} 
            className={`medium-btn medium-btn-outline ${isSaving ? 'saving-indicator' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save draft'}
          </button>
          <button 
            onClick={handlePublish} 
            className="medium-btn medium-btn-publish"
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogEditor;