import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";

import { updateMember } from "../../../services/member.service";

export default function UpdateMemberModal({ show, onHide, member, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null); // ✅ NEW

    const [form, setForm] = useState({
        user_pk: "",
        full_name: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        phone: "",
        country_code: "91",
        is_active: 1
    });

    useEffect(() => {
        if (member) {
            setForm({
                user_pk: member.id,
                full_name: member.full_name || "",
                email: member.email || "",
                dob: member.dob || "",
                gender: member.gender || "",
                address: member.address || "",
                city: member.city || "",
                state: member.state || "",
                country: member.country || "India",
                pincode: member.pincode || "",
                phone: member.phone || "",
                country_code: member.country_code?.replace("+", "") || "91",
                is_active: member.is_active ? 1 : 0
            });

            setPhoto(null); // reset photo on open
        }
    }, [member]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFile = (e) => {
        setPhoto(e.target.files[0]); // ✅ Capture file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("Updating member...");

        try {
            const fd = new FormData();

            Object.keys(form).forEach((key) => {
                fd.append(key, form[key]);
            });

            //  Only append image if changed
            if (photo) {
                fd.append("profile_photo", photo);
            }

            await updateMember(fd);

            toast.success("Member updated successfully", { id: toastId });

            onSuccess && onSuccess();
            onHide();

        } catch (error) {
            console.error("Update error:", error);

            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Failed to update member";

            toast.error(msg, { id: toastId });

        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
            <form onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fa-solid fa-pen-to-square me-2"></i>
                        Update Member
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row g-3">

                        {/* FULL NAME */}
                        <div className="col-md-6">
                            <label htmlFor="full_name" className="form-label">Full Name</label>
                            <input
                                id="full_name"
                                name="full_name"
                                className="form-control"
                                value={form.full_name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* PHONE */}
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <PhoneInput
                                country={form.country_code || "in"}
                                value={`${form.country_code}${form.phone}`}
                                onChange={(value, country) => {
                                    const withoutCode = value.replace(country.dialCode, "");
                                    setForm((prev) => ({
                                        ...prev,
                                        phone: withoutCode,
                                        country_code: country.dialCode,
                                    }));
                                }}
                                inputProps={{ id: "phone" }}
                                inputStyle={{
                                    width: "100%",
                                    height: "38px"
                                }}
                            />
                        </div>

                        {/* DOB */}
                        <div className="col-md-6">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <input
                                id="dob"
                                type="date"
                                name="dob"
                                className="form-control"
                                value={form.dob}
                                onChange={handleChange}
                            />
                        </div>

                        {/* GENDER */}
                        <div className="col-md-6">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-select"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* STATUS */}
                        <div className="col-md-6">
                            <label className="form-label d-block">Status</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active === 1}
                                    onChange={(e) =>
                                        handleChange({
                                            target: {
                                                name: "is_active",
                                                value: e.target.checked ? 1 : 0
                                            }
                                        })
                                    }
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="ms-2">{form.is_active === 1 ? "Active" : "Inactive"}</span>
                        </div>

                        {/* ✅ PROFILE PHOTO */}
                        <div className="col-md-12">
                            <label htmlFor="profile_photo" className="form-label">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                id="profile_photo"
                                accept="image/*"
                                className="form-control"
                                onChange={handleFile}
                            />

                            {photo && (
                                <small className="text-success">
                                    New image selected: {photo.name}
                                </small>
                            )}
                        </div>

                        {/* ADDRESS */}
                        <div className="col-md-12">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                id="address"
                                name="address"
                                className="form-control"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* CITY */}
                        <div className="col-md-4">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                id="city"
                                name="city"
                                className="form-control"
                                value={form.city}
                                onChange={handleChange}
                            />
                        </div>

                        {/* STATE */}
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">State</label>
                            <input
                                id="state"
                                name="state"
                                className="form-control"
                                value={form.state}
                                onChange={handleChange}
                            />
                        </div>

                        {/* COUNTRY */}
                        <div className="col-md-4">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input
                                id="country"
                                name="country"
                                className="form-control"
                                value={form.country}
                                onChange={handleChange}
                            />
                        </div>

                        {/* PINCODE */}
                        <div className="col-md-4">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <input
                                type="number"
                                id="pincode"
                                name="pincode"
                                className="form-control"
                                value={form.pincode}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Updating..." : "Update Member"}
                    </Button>
                </Modal.Footer>

            </form>
        </Modal>
    );
}
