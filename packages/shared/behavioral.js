/**
 * 🧠 Behavioral Nudge Engine
 * Behavioral psychology specialist that adapts software interaction cadences
 * and styles to maximize user motivation and success.
 */

export const COMMUNICATION_CHANNELS = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
  IN_APP: 'IN_APP',
  PUSH: 'PUSH'
};

export const INTERACTION_FREQUENCIES = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  AS_NEEDED: 'AS_NEEDED'
};

/**
 * User Preference Schema
 * Represents the user's interaction style, frequency, and cognitive state.
 */
export const defaultUserPsyche = {
  preferredChannel: COMMUNICATION_CHANNELS.IN_APP,
  frequency: INTERACTION_FREQUENCIES.AS_NEEDED,
  tendencies: [], // e.g., 'ADHD', 'GAMIFICATION_DRIVEN'
  status: 'Normal', // 'Overwhelmed', 'Normal', 'Flow'
  completedSprintsToday: 0
};

/**
 * Generates a Time-Boxed Sprint Nudge based on the user's psyche profile.
 * Reduces cognitive load by focusing on single, actionable steps.
 * 
 * @param {Array} pendingTasks - List of tasks the user needs to complete
 * @param {Object} userProfile - The user's Behavioral Psyche profile
 * @returns {Object} The nudge instruction/message payload
 */
export const generateSprintNudge = (pendingTasks = [], userProfile = defaultUserPsyche) => {
  if (!pendingTasks || pendingTasks.length === 0) {
    return {
      channel: userProfile.preferredChannel,
      message: "You're all caught up! Great job staying on top of things. Enjoy your downtime.",
      actionButton: null
    };
  }

  // ADHD or Overwhelmed - Break cognitive load. Offer a micro-sprint instead of a summary.
  if (userProfile.tendencies.includes('ADHD') || userProfile.status === 'Overwhelmed') {
    return {
      channel: userProfile.preferredChannel === COMMUNICATION_CHANNELS.EMAIL ? COMMUNICATION_CHANNELS.SMS : userProfile.preferredChannel, // Use out-of-band push for off-platform engagement
      message: `Hey! You've got a few quick follow-ups pending. Let's see how many we can knock out in the next 5 mins. I'll tee up the first draft: ${pendingTasks[0].title}. Ready?`,
      actionButton: "Start 5 Min Sprint"
    };
  }
  
  // Gamification Driven
  if (userProfile.tendencies.includes('GAMIFICATION_DRIVEN')) {
    const sprintsDone = userProfile.completedSprintsToday || 0;
    const badgeName = sprintsDone > 0 ? (sprintsDone > 2 ? 'Gold Streak Multiplier' : 'Silver Sprint Badge') : 'Daily Momentum Badge';
    
    return {
      channel: userProfile.preferredChannel,
      message: `You're on a streak! Complete ${pendingTasks.length > 3 ? 3 : pendingTasks.length} tasks right now to earn your ${badgeName}. First up: ${pendingTasks[0].title}.`,
      actionButton: sprintsDone > 0 ? "Upgrade My Badge" : "Claim My Badge"
    };
  }

  // Standard execution for a standard profile
  return {
    channel: userProfile.preferredChannel,
    message: `You have ${pendingTasks.length} pending items. Here is the highest priority: ${pendingTasks[0].title}.`,
    actionButton: "Review Task"
  };
};

/**
 * Generates Reinforcement/Celebration copy after a task or sprint is completed.
 * Leverages default biases and immediate positive reinforcement.
 * 
 * @param {number} completedCount - Number of tasks just completed
 * @param {Object} userProfile - The user's Behavioral Psyche profile
 * @returns {Object} Celebration message and next default action
 */
export const generateCelebrationOffRamp = (completedCount, userProfile = defaultUserPsyche) => {
  const newSprintsTotal = (userProfile.completedSprintsToday || 0) + 1;
  const nextState = {
    completedSprintsToday: newSprintsTotal,
    status: userProfile.status === 'Overwhelmed' ? 'Normal' : userProfile.status // Assume clearing a sprint reduces overwhelm
  };
  
  if (userProfile.tendencies.includes('ADHD') || userProfile.status === 'Overwhelmed') {
    return {
      message: `Nice work! We just cleared ${completedCount} items. That’s amazing momentum. Want to do another 5 minutes, or call it for now?`,
      primaryAction: "Call it for now (Opt-out)",
      secondaryAction: "Another 5 Mins!",
      nextState
    };
  }

  return {
    message: `Great job! You've completed ${completedCount} task(s). You've done ${newSprintsTotal} sprint(s) today.`,
    primaryAction: "Continue Working",
    secondaryAction: "Take a Break",
    nextState
  };
};

/**
 * Nudge Sequence Logic
 * Determines the next channel and timing based on the day of inactivity.
 * 
 * @param {number} daysInactive - Number of days the user has been inactive
 * @param {Object} userProfile - The user's Behavioral Psyche profile
 * @returns {Object} Escalation logic for the nudge
 */
export const getNudgeSequence = (daysInactive, userProfile = defaultUserPsyche) => {
  if (daysInactive >= 7) {
    return {
      channel: COMMUNICATION_CHANNELS.IN_APP, // Also send a push notification if mobile
      urgency: 'LOW',
      message: "It's been a week! Is our current cadence working for you? Let's adjust if needed.",
      action: "Update Preferences"
    };
  }
  
  if (daysInactive >= 3) {
    return {
      channel: COMMUNICATION_CHANNELS.EMAIL,
      urgency: 'MEDIUM',
      message: "Here is your quick summary of things you might have missed. Just one click to get back in.",
      action: "View Digest"
    };
  }

  if (daysInactive >= 1) {
    return {
      channel: userProfile.preferredChannel,
      urgency: 'LOW',
      message: "Just a gentle nudge! You have a couple of small items pending.",
      action: "View Items"
    };
  }

  return null; // No nudge needed
};
