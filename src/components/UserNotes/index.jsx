import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, Divider } from "@mui/material";
import { AppContext } from "../../context";
import fetchModel from "../../lib/fetchModelData";

function UserNotes() {
    const { token, user } = useContext(AppContext);

    const [notes, setNotes] = useState([]);
    const [noteId, setNoteId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedContent, setEditedContent] = useState(content);
    const [image, setImage] = useState(null);
    const [editedImage, setEditedImage] = useState(null);
    const [isEdited, setIsEdited] = useState(false);
  
    console.log(editedTitle);
    console.log(editedContent);


    const loadNotes = async () => {
        fetchModel('/note')
        .then(data => setNotes(data))
        .catch(err => console.log(err));
    }

    useEffect(() => {
        loadNotes();
    }, [user])

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            // TODO 1: Khởi tạo biến formData bằng `new FormData()`
            const formData = new FormData();

            // TODO 2: Dùng .append() để đưa "title" và "content" vào formData
            formData.append('title', title);
            formData.append('content', content);

            // TODO 3: Nếu biến state `image` có dữ liệu, append nó vào formData với key là "uploadedphoto" (để khớp với multer ở BE)
            if (image) formData.append('uploadedphoto', image);

            // TODO 4: Dùng fetch() gọi POST lên 'http://localhost:8081/api/note'. 
            // LƯU Ý ĐẶC BIỆT: Trong headers KHÔNG set 'Content-Type' (trình duyệt sẽ tự làm việc này), CHỈ set 'Authorization'. Truyền body là formData.
            
            const res = await fetch('http://localhost:8081/api/note',{
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + token,
                },
                body: formData
            }); // Tự viết code fetch của bạn thay cho dòng này
            if (res.ok) {
                loadNotes();
                setTitle("");
                setContent("");
                setImage(null); // Xóa ảnh tạm sau khi upload thành công
            }
        } catch (err) {console.log(err)}
    }
    const handleDeleteNote = async (noteId) => {
        try {
            const res = await fetch(
                `http://localhost:8081/api/note/${noteId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
            );
            if (res.ok) {
                loadNotes();
            }
        } catch (err) {console.log(err)}
    }
    const handleSendEditNote = async (noteId) => {
        try{
            const formData = new FormData();
            formData.append('title', editedTitle);
            formData.append('content', editedContent);
            if(editedImage) formData.append('uploadedphoto', editedImage);
            const res = await fetch(
                `http://localhost:8081/api/note/${noteId}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                    body: formData
                }
            );
            if(res.ok){
                loadNotes();
                setIsEdited(false);
                setEditedTitle("");
                setEditedContent("");
                setEditedImage(null);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    const handleEditNote = (note) => {
        setEditedTitle(note.title);
        setEditedContent(note.content);
        setEditedImage(note.file_mage);
        setIsEdited(true);
        setNoteId(note._id);
    }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Ghi chú của tôi</Typography>
      <Divider sx={{ mb: 3 }} />
        <Card sx={{ p: 2, mb: 4, backgroundColor: "#f9f9f9" }}>
            <form onSubmit={handleAddNote}>
                <TextField 
                    fullWidth
                    sx={{ mb: 2 }}
                    label='Title'
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField 
                    fullWidth
                    sx={{ mb: 2 }}
                    label='Content'
                    value={content}
                    multiline
                    rows={3}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Box>
                    <Button 
                        type='submit'
                        variant='contained'
                        color='primary'
                        sx={{ mr : 2}}
                    >
                        Thêm ghi chú
                    </Button>
                    <Button 
                        component='label'
                        variant='contained'
                        color='primary'
                    >
                        <input 
                            hidden
                            type='file'
                            accept='image/*'
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image ? image.name : "Thêm ảnh"}
                    </Button>
                </Box>
            </form>
        </Card>
        {notes.map((note) => 
            <Box key={note._id} sx={{ mb: 2 }}>
                <Card>
                    <CardContent>
                        {isEdited && note._id === noteId ?
                            <Box>
                                <Typography variant='h6'>Title</Typography>
                                <TextField 
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <Typography variant='h6'>Content</Typography>
                                <TextField 
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={editedContent}
                                    multiline
                                    rows={3}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                                <Button
                                    component='label'
                                    variant='contained'
                                    color='primary'
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={ e => setEditedImage(e.target.files[0])}
                                    />
                                    {editedImage ?  note.file_name ? "Thay ảnh" : "Thêm ảnh" : editedImage}
                                </Button>
                            </Box> 
                        :
                            <Box>
                                <Typography variant='h6'>{note.title}</Typography>
                                <Typography variant='body1'>{note.content}</Typography>
                                {/* Kiểm tra nếu ghi chú có file_name thì render thẻ img */}
                                {note.file_name && (
                                    <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
                                        <img 
                                            src={`http://localhost:8081/images/${note.file_name}`} 
                                            alt={note.title} 
                                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
                                        />
                                    </Box>
                                )}
                            </Box>
                        }

                        <Button 
                            onClick={() => {
                                if(isEdited) return setIsEdited(false);
                                else return handleDeleteNote(note._id);
                            }}
                            variant='contained'
                            color='secondary'
                            sx={{ mr: 2 }}
                        >
                            {isEdited ? "Hủy" : "Xóa"}
                        </Button>
                        <Button 
                            onClick={() => {
                                if(isEdited) return handleSendEditNote(note._id);
                                else return handleEditNote(note)}}
                            variant='contained'
                            color='primary'
                        >
                            {isEdited ? "Xác nhận" : "Sửa"}
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        )}
    </Box>
  );
}

export default UserNotes;