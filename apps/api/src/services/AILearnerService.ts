import { Recommendation, LearningResource, Profile, SkillGap, AIConversation, AIMessage, User } from '../models';
import { aiService } from '../ai/AIService';
import { JobService } from './JobService';

export class AILearnerService {
  static async generateRecommendations(learnerId: string) {
    const { PersonalizationService } = require('./PersonalizationService');
    return PersonalizationService.generateDeterministicRecommendations(learnerId);
  }

  static async chat(learnerId: string, conversationId: string, message: string, resourceId?: string) {
    let convo = await AIConversation.findOne({ _id: conversationId, learnerId });
    if (!convo) {
      convo = await AIConversation.create({ learnerId, title: 'New Conversation' });
    }

    // Save user msg
    await AIMessage.create({ conversationId: convo._id, role: 'user', content: message });

    // Fetch history
    const history = await AIMessage.find({ conversationId: convo._id }).sort({ createdAt: 1 });
    const mappedHistory = history.map(h => ({ role: h.role as 'user'|'assistant'|'system', content: h.content }));

    let contextChunks: string[] = [];
    if (resourceId) {
      const { MaterialChunk } = require('../models');
      const chunks = await MaterialChunk.find({ materialId: resourceId }).limit(5);
      contextChunks = chunks.map((c: any) => c.text);
    }

    // Fetch User Profile and Skill Gaps for context
    const profile = await Profile.findOne({ user: learnerId }).populate('department designation');
    const skillGaps = await SkillGap.find({ learner: learnerId, gapClassification: { $gte: 2 } }).populate('competency');
    const userContextStr = `User Profile: Department: ${(profile?.department as any)?.name || 'Unknown'}, Role: ${(profile?.designation as any)?.name || 'Unknown'}.
Current Skill Gaps: ${skillGaps.map(g => (g.competency as any).name).join(', ') || 'None'}.`;
    
    contextChunks.push(userContextStr);

    const reply = await aiService.chat(learnerId, mappedHistory, contextChunks);

    // Save assistant msg
    const botMsg = await AIMessage.create({ conversationId: convo._id, role: 'assistant', content: reply.message });

    return { conversationId: convo._id, reply: botMsg };
  }
}
