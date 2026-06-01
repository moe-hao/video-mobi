import { Autocomplete, Description, EmptyState, Label, ListBox, SearchField } from "@heroui/react";
import { useEffect, useState } from "react";
import { useEpisodeState } from "@app/manage-web/hooks/episode";
import type { CollectionTableListRespItem } from "@lib/common/dto/collection";
import type { Language } from "@lib/common/consts/region";

type SearchEpisode = {
  search: string;
  languageCode?: string;
}

interface EpisodeSearchSelectProps {
  value: CollectionTableListRespItem;
  onChange: (episode: CollectionTableListRespItem) => void;
  languageCode?: string;
  isDisabled?: boolean;
}

export function EpisodeSearchSelect({ value, onChange, languageCode, isDisabled }: EpisodeSearchSelectProps) {
  const [searchEpisode, setSearchEpisode] = useState<SearchEpisode>({
    search: "",
    languageCode: languageCode,
  });

  const { episodeListState, fetchEpisodeList } = useEpisodeState();

  useEffect(() => {
    if (!languageCode || isDisabled) {
      return;
    }
    fetchEpisodeList({
      search: "",
      page: 1,
      size: 30,
      language: languageCode as Language,
    });
  }, [languageCode, isDisabled]);

  const handleSearchEpisode = async (search: string) => {
    if (!languageCode || isDisabled) return;
    setSearchEpisode(prev => ({ ...prev, search, languageCode }));
    await fetchEpisodeList({
      search,
      page: 1,
      size: 30,
      language: languageCode as Language,
    });
  };

  return (
    <>
      <Autocomplete className="w-full min-w-0" placeholder={isDisabled ? "请选择语言" : "搜索剧集"} variant="secondary" aria-label="搜索剧集" allowsEmptyCollection
        isDisabled={isDisabled}
        value={value.id ?? ""}
        onChange={(id) => {
          if (!id) {
            onChange({} as CollectionTableListRespItem);
            return;
          }
          const selected = episodeListState.list?.find(item => item.id === id);
          if (selected) {
            onChange(selected);
          }
        }}
      >
        <Autocomplete.Trigger>
          <Autocomplete.Value className="truncate">{value.name && `${value.name} - ${value.sourceName}`}</Autocomplete.Value>
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter
            inputValue={searchEpisode.search}
            onInputChange={(val) => handleSearchEpisode(val)}
          >
            <SearchField className="sticky top-0 z-10" name="search" variant="secondary" aria-label="搜索剧集">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search characters..." aria-label="搜索剧集输入框" />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>} className="max-h-72 overflow-y-auto">
              {
                episodeListState.list?.map((searchEpisodeListItem) => (
                  <ListBox.Item
                    className="min-h-12"
                    key={searchEpisodeListItem.id} id={searchEpisodeListItem.id} textValue={`${searchEpisodeListItem.name} ${searchEpisodeListItem.sourceName}`}>
                    <div className="flex flex-col">
                      <Label>{searchEpisodeListItem.name}</Label>
                      <Description> [{searchEpisodeListItem.id}] {searchEpisodeListItem.sourceName}</Description>
                    </div>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))
              }
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
    </>
  )
}
