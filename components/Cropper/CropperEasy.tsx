import React, { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Slider,
  Typography,
} from "@mui/material";
import Cropper from "react-easy-crop";
import { Box } from "@mui/system";
import { Cancel, Crop } from "@mui/icons-material";
import getCroppedImg from "./utils/cropImage";
import { useAppDispatch } from "../../stores/hooks";
import { updateProfilcePicture } from "../../stores/user/UserActions";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicId: number;
  bannerPicId: number;
  score: number;
  level: number;
  levelTotal: number;
  frameName: string;
  bio: string;
  facebook: string;
  instagram: string;
  linktree: string;
}

interface Props {
  user: User;
  photoURL: any;
  setOpenCrop: any;
  setPhotoURL: any;
  setFile: any;
  submit:any;
}

const CropperEasy = ({
  user,
  photoURL,
  setOpenCrop,
  setPhotoURL,
  setFile,
  submit,
}: Props) => {
  const dispatch = useAppDispatch();
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [rotation, setRotation] = useState<any>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
   // handleUploadProfilePicture();
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );
      setPhotoURL(url);
      setFile(file);
     
      var new_file = new File([file], file?.name);
       submit(new_file);
        /*
      await dispatch(
        updateProfilcePicture({
          user_id: user?.id,
          image: new_file,
        })
      ).then(() => {
        refetchUser();
        setOpenCrop(false);
      });
      */
    } catch (error) {
      console.log('error')
    }
    
  };

  return (
    <>
      <DialogContent
        dividers
        sx={{
          background: "#333",
          position: "relative",
          height: 400,
          width: "auto",
          minWidth: { sm: 500 },
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
        <Box sx={{ width: "100%", mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom)}
            ></Slider>
          </Box>
          <Box>
            <Typography>Rotation: {rotation}</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={360}
              value={rotation}
              onChange={(e, rotation) => setRotation(rotation)}
            ></Slider>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => setOpenCrop(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" startIcon={<Crop />} onClick={cropImage}>
            Crop
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};

export default CropperEasy;

const zoomPercent = (value: any) => {
  return `${Math.round(value * 100)}%`;
};
