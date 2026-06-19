import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ArchiveCalendar } from "@/components/news/ArchiveCalendar";
import type { DigestIndexEntry } from "@/types/digest";

// 최신순 엔트리 — 6월 두 건(중간 공백 포함), 5월 한 건.
const entries: DigestIndexEntry[] = [
  { date: "2026-06-19", path: "archive/2026-06-19.json", count: 12 },
  { date: "2026-06-16", path: "archive/2026-06-16.json", count: 8 },
  { date: "2026-05-31", path: "archive/2026-05-31.json", count: 15 },
];

function renderCalendar() {
  return render(
    <MemoryRouter>
      <ArchiveCalendar entries={entries} />
    </MemoryRouter>,
  );
}

describe("ArchiveCalendar", () => {
  it("최신 달(2026년 6월)을 기본으로 보여준다", () => {
    renderCalendar();
    expect(screen.getByText("2026년 6월")).toBeInTheDocument();
  });

  it("발행된 날만 링크로 만들고 기사 수를 표시한다", () => {
    renderCalendar();
    const jun19 = screen.getByLabelText("6월 19일 다이제스트 기사 12건");
    expect(jun19).toHaveAttribute("href", "/archive/2026-06-19");
    expect(within(jun19).getByText("12")).toBeInTheDocument();

    // 발행되지 않은 날(6월 18일)은 링크가 아니다.
    expect(
      screen.queryByLabelText(/6월 18일 다이제스트/),
    ).not.toBeInTheDocument();
  });

  it("이전 달로 이동하면 5월 엔트리가 나타난다", () => {
    renderCalendar();
    fireEvent.click(screen.getByLabelText("이전 달"));
    expect(screen.getByText("2026년 5월")).toBeInTheDocument();
    const may31 = screen.getByLabelText("5월 31일 다이제스트 기사 15건");
    expect(may31).toHaveAttribute("href", "/archive/2026-05-31");
  });

  it("최신 달에서는 다음 달 버튼이, 가장 오래된 달에서는 이전 달 버튼이 비활성화된다", () => {
    renderCalendar();
    // 최신 달(6월) → 다음 버튼 비활성.
    expect(screen.getByLabelText("다음 달")).toBeDisabled();
    expect(screen.getByLabelText("이전 달")).toBeEnabled();

    // 가장 오래된 달(5월)로 이동 → 이전 버튼 비활성.
    fireEvent.click(screen.getByLabelText("이전 달"));
    expect(screen.getByLabelText("이전 달")).toBeDisabled();
    expect(screen.getByLabelText("다음 달")).toBeEnabled();
  });
});
