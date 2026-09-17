import * as aiService from "../services/aiAdmission.service.js";
import { runAICrawler, checkCooldown, formatRemaining } from "../services/aiCrawler.service.js";

export const getDiscoveries = async (req, res) => {
  try {
    const { status = "all" } = req.query;
    const data = await aiService.getAllDiscoveries(status);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDiscoveryDetail = async (req, res) => {
  try {
    const data = await aiService.getDiscoveryById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const approveDiscovery = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await aiService.approveDiscovery(id, adminName, adminNote);
    res.json({ success: true, data: result, message: `✅ Discovery approved and published by ${adminName}` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rejectDiscovery = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Rejection reason must be at least 5 characters" });
    }
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await aiService.rejectDiscovery(id, reason, adminName);
    res.json({ success: true, data: result, message: "Discovery rejected" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const editDiscovery = async (req, res) => {
  try {
    const { id } = req.params;
    const adminName = req.user?.name || "Syed Iftikhar Shah";
    const result = await aiService.editDiscovery(id, req.body, adminName);
    res.json({ success: true, data: result, message: "Discovery data updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getActivityLog = async (req, res) => {
  try {
    const data = await aiService.getActivityLog(50);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const data = await aiService.getDashboardStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const triggerCrawl = async (req, res) => {
  try {
    const adminName = req.user?.name || req.user?.email || "admin";

    // ── Check cooldown before doing anything ──────────────────────────────────
    // checkCooldown() reads from Firestore — persists across server restarts.
    const { onCooldown, remainingMs, lastRunAt } = await checkCooldown();

    if (onCooldown) {
      const remaining = formatRemaining(remainingMs);
      const lastRanAgo = lastRunAt
        ? `${Math.floor((Date.now() - lastRunAt.getTime()) / 3600000)}h ago`
        : "recently";

      console.warn(`[Crawler] Manual trigger blocked for ${adminName}. Cooldown active. Remaining: ${remaining}`);

      return res.status(429).json({
        success: false,
        onCooldown: true,
        message: `Crawler is on cooldown. Last run: ${lastRanAgo}. Next manual run available in ${remaining}.`,
        remainingMs,
        remaining,
        lastRunAt: lastRunAt?.toISOString() || null,
      });
    }

    // ── Kick off crawler synchronously so we can return real stats ───────────
    // We await here (unlike before) so the admin gets actual results, not just
    // "job queued". The crawl typically completes in 30–90 seconds.
    // If you need fire-and-forget again, restore the runAICrawler().catch() pattern.
    const result = await runAICrawler({ triggeredBy: adminName, skipCooldownCheck: true });

    return res.json({
      success: true,
      data: {
        message: result.message,
        totalAdded: result.totalAdded,
        totalErrors: result.totalErrors,
        report: result.report,
        nextManualRunAvailableIn: "24h",
      },
    });

  } catch (err) {
    console.error("[Crawler] triggerCrawl error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/ai-admissions/cooldown-status ─────────────────────────────────
// Allows the admin UI to poll the cooldown status persistently (on page load
// and after each trigger attempt) without having to click the button.
export const getCooldownStatus = async (req, res) => {
  try {
    const { onCooldown, remainingMs, lastRunAt } = await checkCooldown();
    res.json({
      success: true,
      data: {
        onCooldown,
        remainingMs,
        remaining: onCooldown ? formatRemaining(remainingMs) : null,
        lastRunAt: lastRunAt?.toISOString() || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
