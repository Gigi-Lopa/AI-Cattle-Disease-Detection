from huggingface_hub import snapshot_download


model_path = snapshot_download(
    repo_id="SrimathiE21ALR044/Cattle_Skin_Disease",
    local_dir="./models/Cattle_Skin_Disease",
    local_dir_use_symlinks=False  # Avoids symlinks (optional)
)
