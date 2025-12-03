import {Resume} from "../models/Resume.js";
import jwt from "jsonwebtoken";

export const saveResume = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { resumeId, resumeName, templateId, templateData } = req.body;

    if (!templateId || !templateData) {
      return res.status(400).json({ success: false, message: "Template ID and data are required" });
    }

    let resume;

    if (resumeId) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { 
          resumeName: resumeName || "Untitled Resume",
          templateId,
          templateData,
          lastModified: new Date()
        },
        { new: true }
      );

      if (!resume) {
        return res.status(404).json({ success: false, message: "Resume not found" });
      }
    } else {
      // Create new resume
      resume = await Resume.create({
        userId,
        resumeName: resumeName || "Untitled Resume",
        templateId,
        templateData,
        lastModified: new Date()
      });
    }

    res.json({
      success: true,
      message: resumeId ? "Resume updated successfully" : "Resume saved successfully",
      resume: {
        id: resume._id,
        resumeName: resume.resumeName,
        templateId: resume.templateId,
        lastModified: resume.lastModified
      }
    });

  } catch (error) {
    console.error("Save resume error:", error);
    res.status(500).json({ success: false, message: "Failed to save resume" });
  }
};

export const getResumes = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resumes = await Resume.find({ userId: decoded.id })
      .select("-templateData")
      .sort({ lastModified: -1 });

    res.json({
      success: true,
      resumes
    });

  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resumes" });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: decoded.id 
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resume" });
  }
};

export const getLatestResumeByTemplate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resume = await Resume.findOne({ 
      userId: decoded.id,
      templateId: req.params.templateId
    }).sort({ lastModified: -1 });

    if (!resume) {
      return res.status(404).json({ success: false, message: "No resume found for this template" });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    console.error("Get latest resume error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resume" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resume = await Resume.findOneAndDelete({ 
      _id: req.params.id, 
      userId: decoded.id 
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.json({
      success: true,
      message: "Resume deleted successfully"
    });

  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ success: false, message: "Failed to delete resume" });
  }
};

export const getResumeCount = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const count = await Resume.countDocuments({ userId: decoded.id });

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error("Get resume count error:", error);
    res.status(500).json({ success: false, message: "Failed to get resume count" });
  }
};
