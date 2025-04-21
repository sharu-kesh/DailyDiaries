import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import { FaBold, FaItalic, FaListUl, FaListOl, FaHeading, FaImage, FaVideo, FaLink, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from 'react-icons/fa';
import './BlogEditor.css';

function BlogEditor() {
  const editorRef = useRef(null);
  const titleImageInputRef = useRef(null);
  const contentImageInputRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBlog = localStorage.getItem('blogDraft');
    if (savedBlog) {
      const { title, subheading, titleImage, content } = JSON.parse(savedBlog);
      document.getElementById('title').value = title || '';
      document.getElementById('subheading').value = subheading || '';
      if (titleImage) {
        const img = document.createElement('img');
        img.src = titleImage;
        img.style.maxWidth = '100px';
        img.style.maxHeight = '100px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        document.querySelector('.preview-title-image').innerHTML = '';
        document.querySelector('.preview-title-image').appendChild(img);
      }
      if (content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, []);

  const saveToLocalStorage = (title, subheading, titleImage, content) => {
    const blogDraft = { title, subheading, titleImage, content };
    localStorage.setItem('blogDraft', JSON.stringify(blogDraft));
  };

  const resizeImage = (file, maxWidth = 800, quality = 0.8) => {
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

        // Convert to base64 with compression
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
      const img = document.createElement('img');
      img.src = resizedBase64;
      img.style.maxWidth = '100px';
      img.style.maxHeight = '100px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '4px';
      document.querySelector('.preview-title-image').innerHTML = '';
      document.querySelector('.preview-title-image').appendChild(img);

      const title = document.getElementById('title').value;
      const subheading = document.getElementById('subheading').value;
      const content = editorRef.current.innerHTML;
      saveToLocalStorage(title, subheading, resizedBase64, content);
    }
  };

  const handleContentImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resizedBase64 = await resizeImage(file);
      const img = `<img src="${resizedBase64}" style="max-width: 100%; margin: 8px 0;" alt="Uploaded image" />`;
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

    // Save to localStorage after content update
    const title = document.getElementById('title').value;
    const subheading = document.getElementById('subheading').value;
    const titleImage = document.querySelector('.preview-title-image').innerHTML ? document.querySelector('.preview-title-image img').src : null;
    const content = editorRef.current.innerHTML;
    saveToLocalStorage(title, subheading, titleImage, content);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();

    // Save to localStorage after formatting
    const title = document.getElementById('title').value;
    const subheading = document.getElementById('subheading').value;
    const titleImage = document.querySelector('.preview-title-image').innerHTML ? document.querySelector('.preview-title-image img').src : null;
    const content = editorRef.current.innerHTML;
    saveToLocalStorage(title, subheading, titleImage, content);
  };

  const handleHeading = (level) => {
    const newTag = level === 'paragraph' ? 'p' : level;
    document.execCommand('formatBlock', false, newTag);
    editorRef.current.focus();

    // Save to localStorage after heading change
    const title = document.getElementById('title').value;
    const subheading = document.getElementById('subheading').value;
    const titleImage = document.querySelector('.preview-title-image').innerHTML ? document.querySelector('.preview-title-image img').src : null;
    const content = editorRef.current.innerHTML;
    saveToLocalStorage(title, subheading, titleImage, content);
  };

  const insertVideo = () => {
    const url = prompt('Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=example)');
    if (url) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n]+)/)?.[1];
      if (videoId) {
        const embed = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="margin: 8px 0;"></iframe>`;
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

  const handlePreview = () => {
    const title = document.getElementById('title').value;
    const subheading = document.getElementById('subheading').value;
    const content = editorRef.current.innerHTML;
    const titleImage = document.querySelector('.preview-title-image').innerHTML;

    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title || 'Blog Preview'}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
          img { max-width: 100%; height: auto; }
          iframe { max-width: 100%; }
          ul { list-style-type: disc; padding-left: 32px; }
          ol { list-style-type: decimal; padding-left: 32px; }
          .buttons { margin-top: 20px; }
          button { padding: 8px 16px; margin-right: 10px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="preview-title-image">${titleImage}</div>
        <h1>${title || 'Untitled Blog'}</h1>
        <h3>${subheading || ''}</h3>
        <div>${content || 'No content yet'}</div>
        <div class="buttons">
          <button onclick="window.close()">Confirm and Return</button>
          <button onclick="window.opener.focus(); window.close()">Edit Blog</button>
        </div>
      </body>
      </html>
    `);
    previewWindow.document.close();
  };

  const handleCreate = async () => {
    const title = document.getElementById('title').value;
    const subheading = document.getElementById('subheading').value;
    const content = editorRef.current.innerHTML;
    const titleImage = document.querySelector('.preview-title-image').innerHTML ? document.querySelector('.preview-title-image img').src : null;

    const blogData = { title, subheading, titleImage, content };

    try {
      const response = await axios.post('http://localhost:8080/api/blogs', blogData);
      console.log('Blog created:', response.data);
      alert('Blog created successfully!');
      localStorage.removeItem('blogDraft'); // Clear draft after successful creation
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog');
    }
  };

  const handleInputChange = () => {
    const title = document.getElementById('title').value;
    const subheading = document.getElementById('subheading').value;
    const titleImage = document.querySelector('.preview-title-image').innerHTML ? document.querySelector('.preview-title-image img').src : null;
    const content = editorRef.current.innerHTML;
    saveToLocalStorage(title, subheading, titleImage, content);
  };

  return (
    <div style={{ textAlign: 'center', marginLeft: '256px' }}>
      <h2 style={{ marginTop: '100px' }}>Hello from DailyDiaries</h2>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#fff',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
                htmlFor="title"
              >
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter your blog title"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
                htmlFor="titleImage"
              >
                Upload Title Image
              </label>
              <input
                type="file"
                id="titleImage"
                ref={titleImageInputRef}
                accept="image/*"
                onChange={handleTitleImageChange}
                style={{ width: '100%', padding: '8px 0' }}
              />
              <div className="preview-title-image" style={{ marginTop: '8px', maxWidth: '100px', maxHeight: '100px', overflow: 'hidden' }}></div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
            }}
            htmlFor="subheading"
          >
            Subheading
          </label>
          <input
            type="text"
            id="subheading"
            placeholder="Enter your subheading"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            Blog Content
          </label>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            <div
              style={{
                backgroundColor: '#f7f7f7',
                borderBottom: '1px solid #ddd',
                padding: '8px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <button onClick={() => execCommand('bold')} title="Bold" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaBold />
              </button>
              <button onClick={() => execCommand('italic')} title="Italic" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaItalic />
              </button>
              <button onClick={() => handleHeading('h1')} title="Heading 1" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaHeading style={{ fontSize: '18px' }} />
              </button>
              <button onClick={() => handleHeading('h2')} title="Heading 2" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaHeading style={{ fontSize: '14px' }} />
              </button>
              <button onClick={() => handleHeading('paragraph')} title="Paragraph" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                P
              </button>
              <button onClick={() => execCommand('insertUnorderedList')} title="Bulleted List" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaListUl />
              </button>
              <button onClick={() => execCommand('insertOrderedList')} title="Numbered List" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaListOl />
              </button>
              <button onClick={() => contentImageInputRef.current.click()} title="Insert Image" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaImage />
              </button>
              <input type="file" ref={contentImageInputRef} accept="image/*" onChange={handleContentImageChange} style={{ display: 'none' }} />
              <button onClick={insertVideo} title="Insert Video" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaVideo />
              </button>
              <button onClick={insertLink} title="Insert Link" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaLink />
              </button>
              <button onClick={() => execCommand('justifyLeft')} title="Align Left" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaAlignLeft />
              </button>
              <button onClick={() => execCommand('justifyCenter')} title="Align Center" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaAlignCenter />
              </button>
              <button onClick={() => execCommand('justifyRight')} title="Align Right" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaAlignRight />
              </button>
              <button onClick={() => execCommand('justifyFull')} title="Justify" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaAlignJustify />
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              dir="ltr"
              className="editor-content"
              style={{
                minHeight: '300px',
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '0 0 4px 4px',
                fontSize: '16px',
                lineHeight: '1.6',
                outline: 'none',
                textAlign: 'left',
              }}
              onInput={handleInputChange}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={handlePreview}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Preview
          </button>
          <button
            onClick={handleCreate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogEditor;