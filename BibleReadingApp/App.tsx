// App.tsx
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Progress from 'react-native-progress';

interface BibleBooks {
  [key: string]: number;
}

const BIBLE_BOOKS: BibleBooks = {
  '창세기': 50,
  '출애굽기': 40,
  '레위기': 27,
  '민수기': 36,
  '신명기': 34,
  '여호수아': 24,
  '사사기': 21,
  '룻기': 4,
  '사무엘상': 31,
  '사무엘하': 24,
  '열왕기상': 22,
  '열왕기하': 25,
  '역대상': 29,
  '역대하': 36,
  '에스라': 10,
  '느헤미야': 13,
  '에스더': 10,
  '욥기': 42,
  '시편': 150,
  '잠언': 31,
  '전도서': 12,
  '아가': 8,
  '이사야': 66,
  '예레미야': 52,
  '예레미야애가': 5,
  '에스겔': 48,
  '다니엘': 12,
  '호세아': 14,
  '요엘': 3,
  '아모스': 9,
  '오바댜': 1,
  '요나': 4,
  '미가': 7,
  '나훔': 3,
  '하박국': 3,
  '스바냐': 3,
  '학개': 2,
  '스가랴': 14,
  '말라기': 4,
  '마태복음': 28,
  '마가복음': 16,
  '누가복음': 24,
  '요한복음': 21,
  '사도행전': 28,
  '로마서': 16,
  '고린도전서': 16,
  '고린도후서': 13,
  '갈라디아서': 6,
  '에베소서': 6,
  '빌립보서': 4,
  '골로새서': 4,
  '데살로니가전서': 5,
  '데살로니가후서': 3,
  '디모데전서': 6,
  '디모데후서': 4,
  '디도서': 3,
  '빌레몬서': 1,
  '히브리서': 13,
  '야고보서': 5,
  '베드로전서': 5,
  '베드로후서': 3,
  '요한일서': 5,
  '요한이서': 1,
  '요한삼서': 1,
  '유다서': 1,
  '요한계시록': 22,
};

type ReadingPosition = [string, number];

const getDaysBetween = (start: Date, end: Date): number[] => {
  const days: number[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    days.push(current.getDay());
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

const calculateChaptersRead = (startDate: Date, targetDate: Date): number => {
  // 날짜가 같으면 0 반환
  if (startDate.getTime() === targetDate.getTime()) {
    if (startDate.getMonth() === 0 && startDate.getDate() === 1) {
      return 0;
    }
  }

  // 시작일이 1월 1일이 아니면, 해당 연도의 1월 1일부터 다시 계산
  if (startDate.getMonth() !== 0 || startDate.getDate() !== 1) {
    startDate = new Date(startDate.getFullYear(), 0, 1);
  }

  const days = getDaysBetween(startDate, targetDate);
  let chaptersRead = 0;
  
  days.forEach(day => {
    chaptersRead += day === 0 ? 5 : 3; // 일요일(0)은 5장, 나머지는 3장
  });

  return chaptersRead - (days.length > 0 ? 3 : 0);  // 첫날의 3장은 제외
};

const findCurrentReadingPosition = (totalChapters: number): ReadingPosition => {
  if (totalChapters <= 0) {
    return ['창세기', 1];
  }
  
  let chaptersCounted = 0;
  for (const [book, chapterCount] of Object.entries(BIBLE_BOOKS)) {
    if (chaptersCounted + chapterCount > totalChapters) {
      const currentChapter = totalChapters - chaptersCounted + 1;
      return [book, currentChapter];
    }
    chaptersCounted += chapterCount;
  }
  return ['완독', 0];
};

function App(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // 해당 연도의 1월 1일을 시작일로 설정
  const startDate = new Date(selectedDate.getFullYear(), 0, 1);
  
  // 읽은 장 수 계산
  const chaptersRead = calculateChaptersRead(startDate, selectedDate);

  // 현재 읽을 위치 찾기
  const [currentBook, currentChapter] = findCurrentReadingPosition(chaptersRead);

  // 전체 성경 장 수
  const totalBibleChapters = Object.values(BIBLE_BOOKS).reduce(
    (a, b) => a + b,
    0,
  );

  // 진행률 계산
  const progress = Math.max(0, chaptersRead / totalBibleChapters);

  // 오늘의 읽을 구절 계산
  const getTodaysReading = (): string[] => {
    if (currentBook === '완독') {
      return [];
    }

    const isSunday = selectedDate.getDay() === 0;
    const chaptersToRead = isSunday ? 5 : 3;
    const readings: string[] = [];

    let remainingChapters = chaptersToRead;
    let currentBookIdx = Object.keys(BIBLE_BOOKS).indexOf(currentBook);
    let tempChapter = currentChapter;
    let tempBook = currentBook;

    while (remainingChapters > 0) {
      const chaptersLeftInBook = BIBLE_BOOKS[tempBook] - tempChapter + 1;

      if (chaptersLeftInBook >= remainingChapters) {
        for (let i = 0; i < remainingChapters; i++) {
          readings.push(`${tempBook} ${tempChapter + i}장`);
        }
        break;
      } else {
        for (let i = 0; i < chaptersLeftInBook; i++) {
          readings.push(`${tempBook} ${tempChapter + i}장`);
        }
        remainingChapters -= chaptersLeftInBook;
        currentBookIdx++;
        if (currentBookIdx < Object.keys(BIBLE_BOOKS).length) {
          tempBook = Object.keys(BIBLE_BOOKS)[currentBookIdx];
          tempChapter = 1;
        } else {
          break;
        }
      }
    }

    return readings;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📖 평삼주오: 성경 읽기 진도 계산기</Text>
        <Text style={styles.subtitle}>📌 평일에는 3장, 주일에는 5장 읽기</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            🗓️ {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event: any, date?: Date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
              }
            }}
          />
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>📅 읽기 진도</Text>
        <Text style={styles.chaptersRead}>총 읽은 장 수: {Math.max(0, chaptersRead)}장</Text>

        {currentBook === '완독' ? (
          <Text style={styles.completionMessage}>
            🎊 축하합니다! 올해 성경 읽기를 완료하셨습니다!
          </Text>
        ) : (
          <>
            <Text style={styles.todayReading}>📖 오늘 읽을 부분:</Text>
            {getTodaysReading().map((reading, index) => (
              <Text key={index} style={styles.readingItem}>
                ✔︎ {reading}
              </Text>
            ))}
          </>
        )}

        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            height={10}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
            borderWidth={0}
          />
          <Text style={styles.progressText}>
            전체 진행률: {(progress * 100).toFixed(1)}%
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chaptersRead: {
    fontSize: 16,
    marginBottom: 15,
  },
  completionMessage: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 20,
  },
  todayReading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  readingItem: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default App;