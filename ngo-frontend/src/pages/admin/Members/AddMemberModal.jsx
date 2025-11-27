import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { addMember } from "../../../services/member.service";
import toast from "react-hot-toast";

export default function AddMemberModal({ show, onHide, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        full_name: "",
        password: "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        phone: "",
        country_code: "91",
        role_pk: 1,
        is_active: 1
    });

    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFile = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fd = new FormData();

            Object.keys(form).forEach((key) => {
                fd.append(key, form[key]);
            });

            if (photo) {
                fd.append("profile_photo", photo);
            }

            await addMember(fd);

            toast.success("Member added successfully ");

            onSuccess && onSuccess();
            onHide();

        } catch (error) {
            console.error("Add member error:", error);

            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Failed to add member ";

            toast.error(msg);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
            <form onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fa-solid fa-user-plus me-2"></i>
                        Add New Member
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row g-3">

                        {/* Full Name */}
                        <div className="col-md-6">
                            <label htmlFor="full_name" className="form-label">
                                Full Name
                            </label>
                            <input
                                id="full_name"
                                type="text"
                                name="full_name"
                                className="form-control"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="col-md-6">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label">
                                Phone
                            </label>

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
                                inputProps={{
                                    name: "phone",
                                    id: "phone"
                                }}
                                inputStyle={{
                                    width: "100%",
                                    height: "38px",
                                }}
                            />
                        </div>

                        {/* DOB */}
                        <div className="col-md-4">
                            <label htmlFor="dob" className="form-label">
                                Date of Birth
                            </label>
                            <input
                                id="dob"
                                type="date"
                                name="dob"
                                className="form-control"
                                value={form.dob}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Gender */}
                        <div className="col-md-4">
                            <label htmlFor="gender" className="form-label">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-select"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Profile Photo */}
                        <div className="col-md-4">
                            <label htmlFor="profile_photo" className="form-label">
                                Profile Photo
                            </label>
                            <input
                                id="profile_photo"
                                type="file"
                                className="form-control"
                                onChange={handleFile}
                            />
                        </div>
                        {/* STATUS */}
                        <div className="col-md-4">
                            <label className="form-label d-block">Status</label>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active == 1}
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

                            <span className="ms-2">{form.is_active == 1 ? "Active" : "Inactive"}</span>
                        </div>

                        {/* Address */}
                        <div className="col-md-12">
                            <label htmlFor="address" className="form-label">
                                Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                className="form-control"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* City */}
                        <div className="col-md-4">
                            <label htmlFor="city" className="form-label">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                name="city"
                                className="form-control"
                                value={form.city}
                                onChange={handleChange}
                            />
                        </div>

                        {/* State */}
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">
                                State
                            </label>
                            <input
                                id="state"
                                type="text"
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

                        {/* Pincode */}
                        <div className="col-md-4">
                            <label htmlFor="pincode" className="form-label">
                                Pincode
                            </label>
                            <input
                                id="pincode"
                                type="text"
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
                        Close
                    </Button>

                    <Button type="submit" variant="success" disabled={loading}>
                        {loading ? "Saving..." : "Add Member"}
                    </Button>
                </Modal.Footer>

            </form>
        </Modal>
    );
}
