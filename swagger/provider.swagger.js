/**
 * @swagger
 * components:
 *   schemas:
 *     ProviderProfile:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: Reference to the User ID
 *           example: "64f1c1b2a3d4e5f67890abcd"
 *         fieldOfSpecialization:
 *           type: string
 *           example: "Cardiology"
 *         subSpecialty:
 *           type: string
 *           example: "Interventional Cardiology"
 *         certificationName:
 *           type: string
 *           example: "Board Certified Cardiologist"
 *         institutionName:
 *           type: string
 *           example: "American Board of Internal Medicine"
 *         yearOfCertification:
 *           type: number
 *           example: 2020
 *         certificateAttachment:
 *           type: string
 *           format: binary
 *           description: Upload certificate file (PDF/JPEG/PNG, Max 5MB)
 *         instituteName:
 *           type: string
 *           example: "Johns Hopkins Hospital"
 *         from:
 *           type: string
 *           format: date
 *           example: "2018-01-01"
 *         to:
 *           type: string
 *           format: date
 *           example: "2021-12-31"
 *         instituteAttachment:
 *           type: string
 *           format: binary
 *           description: Upload institute verification document (PDF/JPEG/PNG, Max 5MB)
 *         country:
 *           type: string
 *           example: "United States"
 *         state:
 *           type: string
 *           example: "California"
 *         licenseAttachment:
 *           type: string
 *           format: binary
 *           description: Upload medical license document (PDF/JPEG/PNG, Max 5MB)
 */
/**
 * @swagger
 * /api/provider/profile:
 *   post:
 *     summary: Create provider profile
 *     tags: [Provider]
 *     security:
 *       - bearerAuth: []
 *     description: Create a provider profile with optional certifications, education, and attachments.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProviderProfile'
 *     responses:
 *       201:
 *         description: Provider profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Provider profile created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ProviderProfile'
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/provider/profile:
 *   get:
 *     summary: Get provider profile
 *     tags: [Provider]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the authenticated provider's profile.
 *     responses:
 *       200:
 *         description: Provider profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProviderProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

module.exports = {};
