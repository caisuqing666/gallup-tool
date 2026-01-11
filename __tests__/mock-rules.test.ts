// Mock 规则判断的单元测试
// 确保规则逻辑的稳定性和正确性

import {
  detectStrengthConflicts,
  detectBasementStrength,
  isDemoCase,
  getStrengthDetails,
  getStrengthNames,
  generateAdvantageTips,
  DOMAIN_CONFLICTS,
  SPECIFIC_CONFLICTS,
} from '../lib/mock-rules';
import { ALL_STRENGTHS } from '../lib/gallup-strengths';

describe('Mock Rules', () => {
  describe('detectStrengthConflicts', () => {
    it('应该检测到领域冲突：执行力和战略思维', () => {
      const executing = ALL_STRENGTHS.find(s => s.id === 'focus')!; // 执行力
      const strategic = ALL_STRENGTHS.find(s => s.id === 'analytical')!; // 战略思维
      
      const conflicts = detectStrengthConflicts([executing, strategic]);
      
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0]).toContain(executing.name);
      expect(conflicts[0]).toContain(strategic.name);
    });

    it('应该检测到特殊冲突：统率和和谐', () => {
      const command = ALL_STRENGTHS.find(s => s.id === 'command')!;
      const harmony = ALL_STRENGTHS.find(s => s.id === 'harmony')!;
      
      const conflicts = detectStrengthConflicts([command, harmony]);
      
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts.some(c => c.includes(command.name) && c.includes(harmony.name))).toBe(true);
    });

    it('应该检测到特殊冲突：专注和统筹', () => {
      const focus = ALL_STRENGTHS.find(s => s.id === 'focus')!;
      const arranger = ALL_STRENGTHS.find(s => s.id === 'arranger')!;
      
      const conflicts = detectStrengthConflicts([focus, arranger]);
      
      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts.some(c => c.includes(focus.name) && c.includes(arranger.name))).toBe(true);
    });

    it('不应该检测到非冲突的优势', () => {
      // 选择同一领域内不冲突的优势（都在执行力领域，且不在特殊冲突列表中）
      const achiever = ALL_STRENGTHS.find(s => s.id === 'achiever')!; // 执行力
      const responsibility = ALL_STRENGTHS.find(s => s.id === 'responsibility')!; // 执行力
      
      const conflicts = detectStrengthConflicts([achiever, responsibility]);
      
      // 同一领域内的优势不应该冲突（除非在特殊冲突列表中）
      expect(conflicts.length).toBe(0);
    });

    it('最多返回2个冲突', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'focus')!,
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
        ALL_STRENGTHS.find(s => s.id === 'command')!,
        ALL_STRENGTHS.find(s => s.id === 'harmony')!,
      ];
      
      const conflicts = detectStrengthConflicts(strengths);
      
      expect(conflicts.length).toBeLessThanOrEqual(2);
    });
  });

  describe('detectBasementStrength', () => {
    it('工作决策场景应该返回执行力优势', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'responsibility')!,
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
      ];
      
      const basement = detectBasementStrength('work-decision', strengths, '我不知道该先做哪个');
      
      expect(basement).toBe('责任');
    });

    it('效率场景应该返回执行力优势', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'focus')!,
        ALL_STRENGTHS.find(s => s.id === 'arranger')!,
      ];
      
      const basement = detectBasementStrength('efficiency', strengths, '效率很低');
      
      expect(basement).toBe('专注');
    });

    it('沟通场景且没有沟通优势时应该返回第一个优势', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
        ALL_STRENGTHS.find(s => s.id === 'input')!,
      ];
      
      const basement = detectBasementStrength('communication', strengths, '沟通有问题');
      
      expect(basement).toBe('分析');
    });

    it('空数组应该返回 undefined', () => {
      const basement = detectBasementStrength('work-decision', [], '测试');
      
      expect(basement).toBeUndefined();
    });
  });

  describe('isDemoCase', () => {
    it('应该识别"信息黑洞"典型案例', () => {
      const result = isDemoCase('我搜集了很多信息，但无法决策', ['input', 'analytical']);
      
      expect(result).toBe('info-overload');
    });

    it('应该识别"责任过载"典型案例', () => {
      const result = isDemoCase('我承担了太多责任，接不住了', ['responsibility', 'arranger']);
      
      expect(result).toBe('responsibility-overload');
    });

    it('不应该识别非典型案例', () => {
      const result = isDemoCase('我想提升沟通能力', ['communication', 'woo']);
      
      expect(result).toBeNull();
    });

    it('应该对大小写不敏感', () => {
      const result = isDemoCase('我搜集了很多信息，但无法决策', ['INPUT', 'ANALYTICAL']);
      
      expect(result).toBe('info-overload');
    });
  });

  describe('getStrengthDetails', () => {
    it('应该根据 ID 获取优势详情', () => {
      const details = getStrengthDetails(['achiever', 'analytical', 'input']);
      
      expect(details.length).toBe(3);
      expect(details[0].id).toBe('achiever');
      expect(details[1].id).toBe('analytical');
      expect(details[2].id).toBe('input');
    });

    it('应该过滤无效的 ID', () => {
      const details = getStrengthDetails(['achiever', 'invalid-id', 'analytical']);
      
      expect(details.length).toBe(2);
      expect(details[0].id).toBe('achiever');
      expect(details[1].id).toBe('analytical');
    });

    it('最多返回5个优势', () => {
      const details = getStrengthDetails([
        'achiever', 'analytical', 'input', 'arranger', 'focus', 'command'
      ]);
      
      expect(details.length).toBe(5);
    });
  });

  describe('getStrengthNames', () => {
    it('应该返回优势名称列表', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'achiever')!,
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
      ];
      
      const names = getStrengthNames(strengths);
      
      expect(names).toEqual(['成就', '分析']);
    });
  });

  describe('generateAdvantageTips', () => {
    it('工作决策场景应该生成调节建议', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'responsibility')!,
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
      ];
      const strengthNames = getStrengthNames(strengths);
      
      const tips = generateAdvantageTips(
        'work-decision',
        strengths,
        strengthNames,
        '责任',
        [],
        '我不知道该先做哪个'
      );
      
      expect(tips).toBeDefined();
      expect(tips.instruction).toContain('如果你明天还要处理类似的事');
      expect(tips.reduce).toBeDefined();
      expect(tips.increase).toBeDefined();
    });

    it('效率场景应该生成调节建议', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'focus')!,
        ALL_STRENGTHS.find(s => s.id === 'arranger')!,
      ];
      const strengthNames = getStrengthNames(strengths);
      
      const tips = generateAdvantageTips(
        'efficiency',
        strengths,
        strengthNames,
        '专注',
        [],
        '效率很低'
      );
      
      expect(tips).toBeDefined();
      expect(tips.reduce).toBeDefined();
      expect(tips.increase).toBeDefined();
    });

    it('沟通场景应该生成调节建议', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
        ALL_STRENGTHS.find(s => s.id === 'input')!,
      ];
      const strengthNames = getStrengthNames(strengths);
      
      const tips = generateAdvantageTips(
        'communication',
        strengths,
        strengthNames,
        '分析',
        [],
        '沟通有问题'
      );
      
      expect(tips).toBeDefined();
      expect(tips.instruction).toBeTruthy();
    });

    it('职业转换场景应该生成调节建议', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'achiever')!,
        ALL_STRENGTHS.find(s => s.id === 'strategic')!,
      ];
      const strengthNames = getStrengthNames(strengths);
      
      const tips = generateAdvantageTips(
        'career-transition',
        strengths,
        strengthNames,
        undefined,
        [],
        '想换赛道'
      );
      
      expect(tips).toBeDefined();
      expect(tips.reduce).toBeDefined();
      expect(tips.increase).toBeDefined();
    });

    it('如果没有明确场景，应该生成默认建议', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'achiever')!,
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
      ];
      const strengthNames = getStrengthNames(strengths);
      
      const tips = generateAdvantageTips(
        'unknown-scenario',
        strengths,
        strengthNames,
        '成就',
        [],
        '测试'
      );
      
      expect(tips).toBeDefined();
      expect(tips.instruction).toBeTruthy();
    });

    it('应该包含 reduce 和 increase 数组', () => {
      const strengths = [
        ALL_STRENGTHS.find(s => s.id === 'responsibility')!,
        ALL_STRENGTHS.find(s => s.id === 'analytical')!,
      ];
      const strengthNames = getStrengthNames(strengths);
      
      const tips = generateAdvantageTips(
        'work-decision',
        strengths,
        strengthNames,
        '责任',
        [],
        '测试'
      );
      
      if (tips.reduce && tips.reduce.length > 0) {
        expect(tips.reduce[0]).toHaveProperty('strength');
        expect(tips.reduce[0]).toHaveProperty('percentage');
        expect(tips.reduce[0]).toHaveProperty('reason');
      }
      
      if (tips.increase && tips.increase.length > 0) {
        expect(tips.increase[0]).toHaveProperty('strength');
        expect(tips.increase[0]).toHaveProperty('percentage');
        expect(tips.increase[0]).toHaveProperty('reason');
      }
    });
  });
});
