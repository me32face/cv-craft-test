import { ShareUrl, Resume } from "../models/Resume.js";
import { nanoid } from "nanoid";

// Create share link - saves CV data and returns short URL
export const createShareLink = async (req, res) => {
  try {
    const { templateId, templateData } = req.body;

    // Validation
    if (!templateId || !templateData) {
      return res.status(400).json({ 
        success: false, 
        message: "Template ID and data are required" 
      });
    }

    // Size limit check (500KB)
    const dataSize = JSON.stringify(templateData).length;
    if (dataSize > 500000) {
      return res.status(413).json({ 
        success: false, 
        message: "CV data too large" 
      });
    }

    // Generate unique short ID
    const shareId = nanoid(8);

    // Save CV data for sharing (without userId requirement)
    const resume = await Resume.create({
      userId: null, // Public share, no user association
      resumeName: templateData.name || "Shared Resume",
      templateId,
      templateData,
      isDefault: false
    });

    // Create share URL record
    await ShareUrl.create({
      resumeId: resume._id,
      shareId,
      isShared: true,
      shareViewCount: 0,
      shareCreatedAt: new Date()
    });

    // Build share URL
    const shareUrl = `${process.env.FRONTEND_URL}/resume-view?id=${shareId}`;

    return res.status(201).json({
      success: true,
      shareId,
      url: shareUrl
    });

  } catch (error) {
    console.error("Create share link error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to create share link" 
    });
  }
};

// Get shared resume by short ID
export const getSharedResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Share ID is required" 
      });
    }

    // Find share URL record
    const shareRecord = await ShareUrl.findOne({ shareId: id });

    if (!shareRecord) {
      return res.status(404).json({ 
        success: false, 
        message: "Shared CV not found or link expired" 
      });
    }

    // Get resume data
    const resume = await Resume.findById(shareRecord.resumeId);

    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: "Resume data not found" 
      });
    }

    // Increment view count
    shareRecord.shareViewCount += 1;
    await shareRecord.save();

    // Return only necessary data (no userId for privacy)
    return res.status(200).json({
      success: true,
      templateId: resume.templateId,
      templateData: resume.templateData,
      viewCount: shareRecord.shareViewCount
    });

  } catch (error) {
    console.error("Get shared resume error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch shared resume" 
    });
  }
};
