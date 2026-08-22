import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { saveToken } from "../utils/auth";

import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  removeProfilePicture,
} from "../services/profileService";

import { changePassword } from "../services/changePasswordService";

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    profile_picture: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPicturePreview, setShowPicturePreview] =
    useState(false);

  const [removingPicture, setRemovingPicture] =
    useState(false);
  
  const [showRemoveConfirm, setShowRemoveConfirm] =
  useState(false);

  // -----------------------------
  // Load Profile
  // -----------------------------

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data);
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to load profile"
      );
    }
  };

  // -----------------------------
  // Upload Profile Picture
  // -----------------------------

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a JPG, PNG or WEBP image."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Profile picture must be smaller than 5 MB."
      );

      e.target.value = "";
      return;
    }

    try {
      const response =
        await uploadProfilePicture(file);

      setProfile((prev) => ({
        ...prev,
        profile_picture:
          response.profile_picture,
      }));

      toast.success(
        "Profile picture updated successfully!"
      );

      window.location.reload();

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Failed to upload profile picture"
      );
    }

    e.target.value = "";
  };

  // -----------------------------
  // Remove Profile Picture
  // -----------------------------

  const handleRemoveProfilePicture = async () => {
  try {
    setRemovingPicture(true);

    const response =
      await removeProfilePicture();

    setProfile((prev) => ({
      ...prev,
      profile_picture:
        response.profile_picture || "",
    }));

    setShowPicturePreview(false);
    setShowRemoveConfirm(false);

    toast.success(
      "Profile picture removed successfully!"
    );

    // Refresh Navbar and Sidebar
    window.location.reload();

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.detail ||
        "Failed to remove profile picture"
    );

  } finally {
    setRemovingPicture(false);
  }
};

  // -----------------------------
  // Update Profile
  // -----------------------------

  const handleUpdate = async () => {
    try {
      const response = await updateProfile({
        full_name: profile.full_name,
        phone: profile.phone,
      });

      saveToken(response.access_token);

      setProfile(response.user);

      toast.success(
        "Profile updated successfully!"
      );

      window.location.reload();

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Failed to update profile"
      );
    }
  };

  // -----------------------------
  // Change Password
  // -----------------------------

  const handleChangePassword = async () => {
    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {
      await changePassword(
        passwordData
      );

      toast.success(
        "Password changed successfully!"
      );

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Failed to change password"
      );
    }
  };

  return (
    <>
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information"
      />

      <div className="max-w-4xl space-y-8">

        {/* ========================================= */}
        {/* PROFILE PICTURE */}
        {/* ========================================= */}

        <div
          className="
            flex
            items-center
            gap-6
            p-6
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
          "
        >

          {/* Profile Image */}

          <div
            className="
              relative
              w-24
              h-24
              rounded-full
              overflow-hidden
              border-2
              border-blue-500
              shrink-0
              cursor-pointer
              hover:opacity-90
              transition
            "
            onClick={() => {
              if (profile.profile_picture) {
                setShowPicturePreview(true);
              }
            }}
          >

            {profile.profile_picture ? (
              <img
                src={
                  profile.profile_picture.startsWith("http")
                    ? profile.profile_picture
                    : `http://localhost:8000/${profile.profile_picture}`
                }
                alt="Profile"
                className="
                  block
                  w-24
                  h-24
                  rounded-full
                  object-cover
                "
                onError={(e) => {
                  console.error(
                    "Profile image failed to load:",
                    e.currentTarget.src
                  );
                }}
              />
            ) : (
              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-bold
                "
              >
                {profile.full_name
                  ? profile.full_name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>
            )}

          </div>

          {/* Upload / Remove Section */}

          <div>

            <h3
              className="
                text-xl
                font-bold
                text-slate-800
                dark:text-white
              "
            >
              Profile Picture
            </h3>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
                mb-4
              "
            >
              Upload a JPG, PNG or WEBP image.
            </p>

            <div className="flex flex-wrap gap-3">

              {/* Choose Picture */}

              <label
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-5
                  py-2.5
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  cursor-pointer
                  transition
                "
              >
                Choose Picture

                <input
                  type="file"
                  accept="
                    image/jpeg,
                    image/png,
                    image/webp
                  "
                  className="hidden"
                  onChange={
                    handleProfilePictureChange
                  }
                />

              </label>

              {/* Remove Picture */}

              {profile.profile_picture && (
                <button
                  type="button"
                  onClick={() =>
  setShowRemoveConfirm(true)
}
                  disabled={removingPicture}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    px-5
                    py-2.5
                    rounded-xl
                    bg-red-600
                    hover:bg-red-700
                    disabled:bg-red-400
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    transition
                  "
                >
                  {removingPicture
                    ? "Removing..."
                    : "Remove Picture"}
                </button>
              )}

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* PERSONAL INFORMATION */}
        {/* ========================================= */}

        <div
          className="
            rounded-3xl
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-700
            shadow-lg
            p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-slate-800
              dark:text-white
              mb-6
            "
          >
            Personal Information
          </h2>

          <div className="space-y-5">

            {/* Full Name */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Full Name
              </label>

              <input
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    full_name:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

            {/* Email */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Email
              </label>

              <input
                disabled
                value={profile.email}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-slate-100
                  dark:bg-slate-800
                  text-slate-500
                  dark:text-slate-300
                  px-4
                  py-3
                "
              />

            </div>

            {/* Phone */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Phone
              </label>

              <input
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

            {/* Role + Status */}

            <div
              className={`grid gap-5 ${
                String(
                  profile.role
                ).toLowerCase() === "admin"
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >

              {/* Role */}

              <div>

                <label
                  className="
                    block
                    mb-2
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Role
                </label>

                <input
                  disabled
                  value={profile.role}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    dark:border-slate-600
                    bg-slate-100
                    dark:bg-slate-800
                    text-slate-500
                    dark:text-slate-300
                    px-4
                    py-3
                  "
                />

              </div>

              {/* Status */}

              {String(
                profile.role
              ).toLowerCase() !== "admin" && (

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Status
                  </label>

                  <input
                    disabled
                    value={profile.status}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      dark:bg-slate-800
                      text-slate-500
                      dark:text-slate-300
                      px-4
                      py-3
                    "
                  />

                </div>

              )}

            </div>

            {/* Update Button */}

            <Button
              onClick={handleUpdate}
            >
              Update Profile
            </Button>

          </div>

        </div>

        {/* ========================================= */}
        {/* CHANGE PASSWORD */}
        {/* ========================================= */}

        <div
          className="
            rounded-3xl
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-700
            shadow-lg
            p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-slate-800
              dark:text-white
              mb-6
            "
          >
            Change Password
          </h2>

          <div className="space-y-5">

            {/* Current Password */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Current Password
              </label>

              <input
                type="password"
                placeholder="Enter Current Password"
                value={
                  passwordData.current_password
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                "
              />

            </div>

            {/* New Password */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter New Password"
                value={
                  passwordData.new_password
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                "
              />

            </div>

            {/* Confirm Password */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm New Password"
                value={
                  passwordData.confirm_password
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_password:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                "
              />

            </div>

            <Button
              variant="danger"
              onClick={
                handleChangePassword
              }
            >
              Change Password
            </Button>

          </div>

        </div>

      </div>

      {/* ========================================= */}
{/* PROFILE PICTURE PREVIEW */}
{/* ========================================= */}

{showPicturePreview &&
  profile.profile_picture &&
  createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99998]

        flex
        items-center
        justify-center

        bg-black/80
        backdrop-blur-sm

        p-6
      "
      onClick={() =>
        setShowPicturePreview(false)
      }
    >
      <div
        className="
          relative
          max-w-[90vw]
          max-h-[90vh]
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <img
          src={
            profile.profile_picture.startsWith(
              "http"
            )
              ? profile.profile_picture
              : `http://127.0.0.1:8000/${profile.profile_picture}`
          }
          alt="Profile Preview"
          className="
            max-w-[90vw]
            max-h-[85vh]

            w-auto
            h-auto

            object-contain

            rounded-xl

            shadow-2xl
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPicturePreview(false)
          }
          className="
            absolute
            -top-4
            -right-4

            h-10
            w-10

            rounded-full

            bg-white
            text-slate-800

            text-2xl
            font-bold

            shadow-lg

            hover:bg-red-500
            hover:text-white

            transition
          "
        >
          ×
        </button>
      </div>
    </div>,

    document.body
  )}
      {/* ========================================= */}
{/* REMOVE PROFILE PICTURE CONFIRMATION */}
{/* ========================================= */}

{showRemoveConfirm &&
  createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]

        flex
        items-center
        justify-center

        bg-black/70
        backdrop-blur-sm

        p-6
      "
      onClick={() =>
        setShowRemoveConfirm(false)
      }
    >
      <div
        className="
          w-full
          max-w-md

          rounded-2xl

          bg-white
          dark:bg-slate-900

          border
          border-slate-200
          dark:border-slate-700

          shadow-2xl

          p-6
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* Icon */}

        <div
          className="
            mx-auto
            mb-4

            flex
            h-14
            w-14

            items-center
            justify-center

            rounded-full

            bg-red-100
            dark:bg-red-900/30

            text-red-600
            dark:text-red-400

            text-2xl
          "
        >
          🗑️
        </div>

        {/* Title */}

        <h3
          className="
            text-xl
            font-bold
            text-center

            text-slate-800
            dark:text-white
          "
        >
          Remove Profile Picture?
        </h3>

        {/* Message */}

        <p
          className="
            mt-2

            text-center
            text-sm

            text-slate-500
            dark:text-slate-400
          "
        >
          Are you sure you want to remove
          your profile picture?
        </p>

        {/* Buttons */}

        <div
          className="
            mt-6

            flex
            justify-end
            gap-3
          "
        >

          {/* Cancel */}

          <button
            type="button"
            onClick={() =>
              setShowRemoveConfirm(false)
            }
            disabled={removingPicture}
            className="
              px-5
              py-2.5

              rounded-xl

              border
              border-slate-300
              dark:border-slate-600

              text-slate-700
              dark:text-slate-300

              font-semibold

              hover:bg-slate-100
              dark:hover:bg-slate-800

              transition
            "
          >
            Cancel
          </button>

          {/* Remove */}

          <button
            type="button"
            onClick={
              handleRemoveProfilePicture
            }
            disabled={removingPicture}
            className="
              px-5
              py-2.5

              rounded-xl

              bg-red-600
              hover:bg-red-700

              disabled:bg-red-400

              text-white
              font-semibold

              transition
            "
          >
            {removingPicture
              ? "Removing..."
              : "Remove"}
          </button>

        </div>

      </div>
    </div>,

    document.body
  )}
    </>
  );
}