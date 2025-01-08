import streamlit as st
from datetime import datetime, timedelta, date
import calendar

# 성경의 각 권별 장 수 정의
BIBLE_BOOKS = {
    "창세기": 50, "출애굽기": 40, "레위기": 27, "민수기": 36, "신명기": 34,
    "여호수아": 24, "사사기": 21, "룻기": 4, "사무엘상": 31, "사무엘하": 24,
    "열왕기상": 22, "열왕기하": 25, "역대상": 29, "역대하": 36, "에스라": 10,
    "느헤미야": 13, "에스더": 10, "욥기": 42, "시편": 150, "잠언": 31,
    "전도서": 12, "아가": 8, "이사야": 66, "예레미야": 52, "예레미야애가": 5,
    "에스겔": 48, "다니엘": 12, "호세아": 14, "요엘": 3, "아모스": 9,
    "오바댜": 1, "요나": 4, "미가": 7, "나훔": 3, "하박국": 3,
    "스바냐": 3, "학개": 2, "스가랴": 14, "말라기": 4, "마태복음": 28,
    "마가복음": 16, "누가복음": 24, "요한복음": 21, "사도행전": 28, "로마서": 16,
    "고린도전서": 16, "고린도후서": 13, "갈라디아서": 6, "에베소서": 6, "빌립보서": 4,
    "골로새서": 4, "데살로니가전서": 5, "데살로니가후서": 3, "디모데전서": 6, "디모데후서": 4,
    "디도서": 3, "빌레몬서": 1, "히브리서": 13, "야고보서": 5, "베드로전서": 5,
    "베드로후서": 3, "요한일서": 5, "요한이서": 1, "요한삼서": 1, "유다서": 1,
    "요한계시록": 22
}

def calculate_chapters_read(start_date, target_date):
    """주어진 날짜까지 읽은 성경 장 수를 계산"""
    # datetime.date 객체를 datetime.datetime 객체로 변환
    if isinstance(target_date, date):
        target_date = datetime.combine(target_date, datetime.min.time())
    if isinstance(start_date, date):
        start_date = datetime.combine(start_date, datetime.min.time())
    
    total_chapters = 0
    current_date = start_date
    
    while current_date <= target_date:
        # 일요일(6)이면 5장, 그 외에는 3장
        if current_date.weekday() == 6:
            total_chapters += 5
        else:
            total_chapters += 3
        current_date += timedelta(days=1)
    
    return total_chapters

def find_current_reading_position(total_chapters):
    """총 읽은 장 수를 기반으로 현재 읽을 성경 위치 찾기"""
    chapters_counted = 0
    for book, chapter_count in BIBLE_BOOKS.items():
        if chapters_counted + chapter_count > total_chapters:
            current_chapter = total_chapters - chapters_counted + 1
            return book, current_chapter
        chapters_counted += chapter_count
    return "완독", 0

def main():
    st.title("📖 평삼주오: 성경 읽기 진도 계산기")
    st.text("📌 평일에는 3장, 주일에는 5장 읽기")
    
    # 현재 날짜 선택
    today = datetime.now()
    selected_date = st.date_input(
        "🗓️ 날짜를 선택하세요",
        today
    )
    
    # 해당 연도의 1월 1일을 시작일로 설정
    start_date = datetime(selected_date.year, 1, 1)
    
    # 읽은 장 수 계산
    chapters_read = calculate_chapters_read(start_date, selected_date)
    
    # 현재 읽을 위치 찾기
    current_book, current_chapter = find_current_reading_position(chapters_read)
    
    # 결과 표시
    st.write("---")
    st.subheader("📅 읽기 진도")
    st.write(f"총 읽은 장 수: {chapters_read}장")
    
    if current_book == "완독":
        st.success("🎊 축하합니다! 올해 성경 읽기를 완료하셨습니다!")
    else:
        # 오늘이 일요일인지 확인
        is_sunday = selected_date.weekday() == 6
        chapters_to_read = 5 if is_sunday else 3
        
        st.info("📖 오늘 읽을 부분:")
        
        remaining_chapters = chapters_to_read
        current_book_idx = list(BIBLE_BOOKS.keys()).index(current_book)
        temp_chapter = current_chapter
        temp_book = current_book
        
        while remaining_chapters > 0:
            # 현재 책의 남은 장 수 계산
            chapters_left_in_book = BIBLE_BOOKS[temp_book] - temp_chapter + 1
            
            if chapters_left_in_book >= remaining_chapters:
                # 현재 책에서 모든 장을 읽을 수 있는 경우
                for i in range(remaining_chapters):
                    st.write(f"✔︎ {temp_book} {temp_chapter + i}장")
                remaining_chapters = 0
            else:
                # 현재 책을 다 읽고 다음 책으로 넘어가야 하는 경우
                for i in range(chapters_left_in_book):
                    st.write(f"✔︎ {temp_book} {temp_chapter + i}장")
                remaining_chapters -= chapters_left_in_book
                if current_book_idx + 1 < len(BIBLE_BOOKS):
                    current_book_idx += 1
                    temp_book = list(BIBLE_BOOKS.keys())[current_book_idx]
                    temp_chapter = 1
                else:
                    st.warning("올해의 성경 읽기를 완료했습니다!")
                    break
    
    # 진행률 계산
    total_bible_chapters = sum(BIBLE_BOOKS.values())
    progress = (chapters_read / total_bible_chapters) * 100
    st.progress(min(progress / 100, 1.0))
    st.write(f"전체 진행률: {progress:.1f}%")

if __name__ == "__main__":
    main()